resource "aws_vpc_endpoint" "secretsmanager" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.AWS_REGION}.secretsmanager"
  vpc_endpoint_type = "Interface"

  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
  security_group_ids = [aws_security_group.lambda.id]

  private_dns_enabled = true
}

# Add VPC Endpoint for Lambda to communicate with other AWS services
resource "aws_vpc_endpoint" "rds" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.AWS_REGION}.rds"
  vpc_endpoint_type   = "Interface"
  
  subnet_ids          = [aws_subnet.private_a.id, aws_subnet.private_b.id]
  security_group_ids  = [aws_security_group.lambda.id]
  
  private_dns_enabled = true
}
