terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_vpc" "masashi_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "masashi-vpc"
  }
}

resource "aws_internet_gateway" "masashi_igw" {
  vpc_id = aws_vpc.masashi_vpc.id

  tags = {
    Name = "masashi-igw"
  }
}

resource "aws_subnet" "masashi_public_subnet" {
  vpc_id            = aws_vpc.masashi_vpc.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "masashi-public-subnet"
  }
}

resource "aws_subnet" "masashi_private_subnet" {
  vpc_id            = aws_vpc.masashi_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"
  map_public_ip_on_launch = false

  tags = {
    Name = "masashi-private-subnet"
  }
}

resource "aws_nat_gateway" "masashi_nat" {
  allocation_id = aws_eip.masashi_eip.id
  subnet_id     = aws_subnet.masashi_public_subnet.id

  tags = {
    Name = "masashi-nat"
  }
}

resource "aws_eip" "masashi_eip" {
  vpc = true
}

resource "aws_route_table" "masashi_public_rt" {
  vpc_id = aws_vpc.masashi_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.masashi_igw.id
  }

  tags = {
    Name = "masashi-public-rt"
  }
}

resource "aws_route_table_association" "masashi_public_rt_assoc" {
  subnet_id      = aws_subnet.masashi_public_subnet.id
  route_table_id = aws_route_table.masashi_public_rt.id
}

resource "aws_route_table" "masashi_private_rt" {
  vpc_id = aws_vpc.masashi_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.masashi_nat.id
  }

  tags = {
    Name = "masashi-private-rt"
  }
}

resource "aws_route_table_association" "masashi_private_rt_assoc" {
  subnet_id      = aws_subnet.masashi_private_subnet.id
  route_table_id = aws_route_table.masashi_private_rt.id
}

resource "aws_instance" "masashi_instance" {
  ami           = "ami-0e2612a08262410c8"  # 希望するAMI IDを指定してください
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.masashi_public_subnet.id

  tags = {
    Name = "masashi-instance"
  }
}
