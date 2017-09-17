FROM outsideris/aws-lambda-amz-linux:nodejs6.10.3

WORKDIR /www
ADD . /www

ENV DEBUG *
ENV CHROME_PATH /www/functions/webarchive/headless_shell

RUN npm install

CMD ["npm", "test"]
