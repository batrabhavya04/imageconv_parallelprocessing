var express = require('express')
var multer = require('multer')
var fs = require('fs')
const { join } = require('path')
const { spawn } = require('child_process')

var app = express()
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('index')
})

app.use('/cdn', express.static(join(__dirname, 'img')))

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		var dir = join(__dirname, 'img')
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
		}

		callback(null, dir)
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + '_' + file.originalname)
	},
})

const upload = multer({ storage: storage }).array('files', 12)

app.all('/upload', function (req, res, next) {
	upload(req, res, async function (err) {
		const files_data = req.files.map((elem) => elem.filename)
		if (err) {
			return res.end('Something went wrong:(')
		}
		const p = spawn('python', ['run.py', ...files_data])
		p.stdout.on('data', (data) => {
			console.log(data.toString())
			res.render('data', { orig: files_data.map((elem) => './cdn/' + elem), data: files_data.map((elem) => './cdn/filtered.' + elem) })
		})
		p.stderr.on('data', (data) => {
			console.log(data)
		})
		p.stdout.on('error', (data) => {
			console.log(data)
		})
	})
})

app.listen(3000, () => {
	console.log(`Running on port 8000=>3000`)
})
