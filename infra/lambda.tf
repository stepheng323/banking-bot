resource "aws_lambda_function" "handler" {
  function_name = "handler"
  filename      = "../dist/handler.zip"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  memory_size   = 512
  timeout       = 30

    source_code_hash = filebase64sha256("../dist/handler.zip")


  environment {
    variables = {
        NODE_ENV    = "production"
        WHATSAPP_SECRET_TOKEN = var.WHATSAPP_SECRET_TOKEN
        SECRET_NAME = aws_secretsmanager_secret.app_secrets_version.name
    }
  }
}


resource "aws_lambda_function" "consumer" {
  function_name = "consumer"
  filename      = "../dist/consumer.zip"
  handler       = "main.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn

    source_code_hash = filebase64sha256("../dist/consumer.zip")


  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.rds.id]
  }

    environment {
    variables = {
              NODE_ENV    = "production"
              WHATSAPP_SECRET_TOKEN = var.WHATSAPP_SECRET_TOKEN
              SECRET_NAME = aws_secretsmanager_secret.app_secrets_version.name
    }
  }
}
