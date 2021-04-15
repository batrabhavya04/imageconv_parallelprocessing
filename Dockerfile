FROM nikolaik/python-nodejs

WORKDIR /app

COPY requirements.txt /app
COPY package.json /app

RUN pip install --no-cache-dir -r requirements.txt

RUN npm i

CMD ["npm","run","dev"]
