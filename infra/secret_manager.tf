resource "aws_secretsmanager_secret" "app_secrets_version" {
  name = "app_secrets"
}

resource "aws_secretsmanager_secret_version" "app_secrets_version" {
  secret_id     = aws_secretsmanager_secret.app_secrets_version.id
  secret_string = jsonencode({
    WHATSAPP_SECRET_TOKEN=var.WHATSAPP_SECRET_TOKEN
    AWS_QUEUE_URL= var.AWS_QUEUE_URL
    OPENAI_API_KEY=var.OPENAI_API_KEY
    REDIS_URL=var.REDIS_URL
    DATABASE_URL=var.DATABASE_URL
  })
}
