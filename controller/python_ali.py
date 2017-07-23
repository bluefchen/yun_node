#!/usr/bin/env python
#encoding=utf-8

from com.aliyun.api.gateway.sdk import client
from com.aliyun.api.gateway.sdk.http import request
from com.aliyun.api.gateway.sdk.common import constant

host = "http://sms.market.alicloudapi.com"

url = "/singleSendSms" \
    + '?ParamString={"no":"123456"}' \
    + "&RecNum=13120713129" \
    + "&SignName=勤工巧匠" \
    + "&TemplateCode=SMS_78625127"

req = request.Request(host=host, url=url, method="GET", time_out=30000)
cli = client.DefaultClient(app_key="3a46b15289a3475faaccd05be1506aa5", app_secret="APP_SECRET")
print cli.execute(req)