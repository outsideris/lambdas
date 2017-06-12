FROM outsideris/aws-lambda-amz-linux:nodejs6.10.3

WORKDIR /www
ADD . /www

ENV LIGHTHOUSE_CHROMIUM_PATH /www/lib/headless_shell

RUN npm install

CMD ["npm", "test"]
