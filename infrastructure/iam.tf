# role for lambda functions
resource "aws_iam_role" "sideeffect_lambda_function" {
  name = "sideeffect_lambda_function"
  path = "/"
  assume_role_policy = "${data.aws_iam_policy_document.sideeffect_lambda_function.json}"
}
data "aws_iam_policy_document" "sideeffect_lambda_function" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    principals = {
      type = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "sideeffect_lambda_logs" {
  name = "sideeffect_lambda_logs"
  path = "/"
  description = "Allow lambda_function to utilize CloudWatchLogs. Created by apex(1)."
  policy = "${data.aws_iam_policy_document.sideeffect_lambda_logs.json}"
}
data "aws_iam_policy_document" "sideeffect_lambda_logs" {
  statement {
    actions = [
      "logs:*"
    ]

    resources = [
      "*"
    ]
  }
}

resource "aws_iam_policy_attachment" "sideeffect_lambda_logs-policy-attachment" {
  name = "sideeffect_lambda_logs-policy-attachment"
  policy_arn = "arn:aws:iam::410655858509:policy/sideeffect_lambda_logs"
  groups = []
  users = []
  roles = ["${aws_iam_role.sideeffect_lambda_function.name}"]
}
