FROM outsideris/aws-lambda-amz-linux:nodejs6.10.3

WORKDIR /www
ADD . /www

RUN npm install

CMD ["npm", "test"]
