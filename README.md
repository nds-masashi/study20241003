# CDK Project

VPC and EC2 を作成する

5分で理解するAWS CDK
https://qiita.com/Brutus/items/6c8d9bfaab7af53d154a
AWS CDK Workshop
https://cdkworkshop.com/ja/

```
mkdir cdk-workshop && cd cdk-workshop
cdk init sample-app --language typescript
```

・CloudFormationの定義情報が出力
```
cdk synth
```

・CloudFormationスタックとしてデプロイ
```
cdk bootstrap
cdk bootstrap --profile XXXXXXXXXXXX
```

```
aws configure
aws configure list-profiles
```

・deployを実行
```
cdk deploy
```

What is the AWS CDK?
https://docs.aws.amazon.com/cdk/v2/guide/home.html

```
cdk diff
cdk destroy
```
