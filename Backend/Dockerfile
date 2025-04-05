FROM node:18.9.1
WORKDIR /app/karanprojec/backend
COPY package.json .
COPY . .
RUN npm install
RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN npm install -g nodemon
RUN npm install child_process
RUN apt-get update && apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install -r requirements.txt
RUN pip install opencv-python
RUN pip install opencv-python-headless
RUN pip install opencv-contrib-python

EXPOSE 4000
CMD [ "npm","start" ]