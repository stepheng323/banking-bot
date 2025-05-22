resource "aws_lambda_function" "handler" {
  function_name = "handler"
  filename      = "../dist/handler.zip"
  handler       = "main.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  memory_size   = 512
  timeout       = 30

    source_code_hash = filebase64sha256("../dist/handler.zip")


  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
        NODE_ENV    = "production"
        WHATSAPP_SECRET_TOKEN = var.WHATSAPP_SECRET_TOKEN
        SECRET_NAME = aws_secretsmanager_secret.app_secrets_version.name
        AWS_QUEUE_URL = aws_sqs_queue.bankai_queue.id
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
    security_group_ids = [aws_security_group.lambda.id]
  }

    environment {
    variables = {
              NODE_ENV    = "production"
              WHATSAPP_SECRET_TOKEN = var.WHATSAPP_SECRET_TOKEN
              SECRET_NAME = aws_secretsmanager_secret.app_secrets_version.name,
              AWS_QUEUE_URL = aws_sqs_queue.bankai_queue.id
    }
  }
}


resource "aws_sqs_queue" "bankai_queue" {
  name = "bankai-queue"
  visibility_timeout_seconds = 30
}

resource "aws_lambda_event_source_mapping" "bankai_queue_sqs_trigger" {
  event_source_arn = aws_sqs_queue.bankai_queue.arn
  function_name    = aws_lambda_function.consumer.arn
  batch_size       = 10
  enabled          = true
}
