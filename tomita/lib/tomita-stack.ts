import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { Construct } from 'constructs';

export class TomitaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //vpc
    const vpc = new ec2.Vpc(this, 'VPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.10.0.0/16'),
      vpcName: 'tomita-vpc',
      natGateways: 0,
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
      }],
      maxAzs: 2
    });

    //security group
    const sg = new ec2.SecurityGroup(this, 'SecurityGroup', {
      allowAllOutbound: true,
      description: 'Allow ssh access to ec2 instances',
      securityGroupName: 'tomita-instance-sg',
      vpc: vpc,
    });
    sg.addIngressRule(ec2.Peer.ipv4('118.238.231.215/32'), ec2.Port.tcp(22));

    //keypair
    const keyPair = new ec2.KeyPair(this, 'KeyPair', {
      keyPairName: 'tomita-ec2-keypair'
    });

    //ec2
    const instance = new ec2.Instance(this, 'Instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      instanceName: 'tomita-ec2',
      keyPair: keyPair,
      securityGroup: sg,
      vpc: vpc,
      availabilityZone: 'ap-northeast-1a'
    });
  }
}
