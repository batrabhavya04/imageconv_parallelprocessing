from PIL import Image

import queue

import os

import threading
import numpy as np
from scipy import ndimage    
import time

import sys

print(sys.argv)
repeats = len(sys.argv) - 1

def smooth_img(q,im):
    im_stack_tmp = ndimage.filters.gaussian_laplace(im, 2.)
    q.put(im_stack_tmp)


im_all = [None]*repeats
im_all_filtered = [None]*repeats


images = sys.argv[1:]

for j in range(repeats):
    im_all[j] = np.asarray(Image.open('./img/'+images[j]))

start = time.time()
q = queue.Queue()
for im in im_all:
    t = threading.Thread(target=smooth_img, args = (q,im))
    t.daemon = True
    t.start()
for j in range(repeats):
    im_all_filtered[j] = q.get()
print('multi thread: '+str(time.time()-start))
print(im_all[0].shape,im_all_filtered[0].shape)

for i in range(repeats):
    im = Image.fromarray(im_all_filtered[i])
    im.save('./img'+'/'+"filtered."+images[i])

try:
    os.system('chown 1000:1000 '+path)
except:
    print('ok')