// bucket to save screenshots
resource "aws_s3_bucket" "kr_sideeffect_webarchive" {
  bucket = "kr.sideeffect.webarchive"
  acl    = "private"
}

// allow to lambda role to use S3
resource "aws_iam_policy" "apex-s3-tfstate" {
    name = "apex-s3-tfstate"
    description = "allow s3 bucket to save screenshots"
    path = "/"
    policy = "${data.aws_iam_policy_document.allow-s3.json}"
}
data "aws_iam_policy_document" "allow-s3" {
  statement {
    sid = "AllowLambdaToSeeBucketList"
    actions = [
      "s3:ListAllMyBuckets"
    ]

    resources = [
      "arn:aws:s3:::*"
    ]
  }

  statement {
    sid = "AllowAllS3Actions"
    actions = [
      "s3:*",
    ]

    resources = [
      "${aws_s3_bucket.kr_sideeffect_webarchive.arn}/*"
    ]
  }
}

resource "aws_iam_policy_attachment" "lambda-s3-policy-attachment" {
  name = "lambda-s3-policy-attachment"
  policy_arn = "${aws_iam_policy.apex-s3-tfstate.arn}"
  groups = []
  users = []
  roles = ["${aws_iam_role.sideeffect_lambda_function.name}"]
}
