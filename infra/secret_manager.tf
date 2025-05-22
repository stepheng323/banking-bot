resource "aws_secretsmanager_secret" "app_secrets_version" {
  name = "banking_bot_secrets_1"
}

resource "aws_secretsmanager_secret_version" "app_secrets_version" {
  secret_id     = aws_secretsmanager_secret.app_secrets_version.id
  secret_string = jsonencode({
    WHATSAPP_SECRET_TOKEN=var.WHATSAPP_SECRET_TOKEN
    OPENAI_API_KEY=var.OPENAI_API_KEY
    REDIS_URL=var.REDIS_URL
    DATABASE_URL="postgresql://${var.DB_USERNAME}:${var.DB_PASSWORD}@${aws_db_instance.postgres.endpoint}/${var.DB_NAME}"
  })
}
