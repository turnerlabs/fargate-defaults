FROM node:8.10.0
ADD . /opt/fargate-defaults
WORKDIR /opt/fargate-defaults
RUN npm install
CMD ["npm", "start"]
