# baby-front 宝宝煎米果前端项目

### 简介
baby-fried-rice（宝宝煎米果，以下简称baby）是一套由Go语言开发，以用户中心、即时通信、用户空间三个模块为主的分布式微服务后台系统。使用了Gin作为Web框架，Gorm为连接数据库的ORM框架，JWT实现Token验证。服务之间的调用通过gRPC的方式进行，为了方便每个微服务的横向扩展，引入了ETCD作为服务注册中心。使用了NSQ作为消息队列转发消息，引入Redis做热点数据缓存。使用了七牛云云存储服务存储照片、文件等内容。

### 体验入口
[宝宝煎米果](https://babyfriedrice.com)