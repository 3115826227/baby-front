<template>
    <div id="blog">
        <div class="left">
            <div id="blog-search">
                <el-row>
                    <el-col :span="18">
                        <el-input type="text" placeholder="搜搜你想看的吧"></el-input>
                    </el-col>
                    <el-col :span="4" style="margin-left:4%">
                        <el-button type="primary" @click="getBlog">搜索</el-button>
                    </el-col>
                </el-row>
            </div>
            <div id="blog-type">
                <el-row>
                    <el-col :span="20">
                        <el-radio-group v-model="blog_type">
                            <el-radio :label="0">最新</el-radio>
                            <el-radio :label="1">最热</el-radio>
                            <el-radio :label="2">最受喜欢</el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="4" style="text-align:right">
                        <el-button type="success" size="mini" @click="getBlog">刷新</el-button>
                    </el-col>
                </el-row>
            </div>
            <div id="blog-list">
                <el-card v-for="item in blog_list" :key="item.id" style="margin-top:2%;">
                    <div @click="getBlogDetail(item)">
                    <div style="font-size:16px;font-weight:600px;">
                        {{item.title}}
                        <span style="font-size:13px;color:gray;margin-left:1%">{{item.blogger}}</span>
                    </div>
                    <div style="font-size:14px;color:gray;margin-top:2%;">
                        {{item.preview_content}}
                    </div>
                    <div style="margin-top:1%;">
                        <span><el-tag size="mini">{{item.category}}</el-tag></span>
                    </div>
                    <div style="font-size:14px;color:gray;margin-top:2%;">
                        <el-row>
                            <el-col :span="2">
                                <i class="iconfont">&#xe60a; </i>{{item.like_total}}
                            </el-col>
                            <el-col :span="2">
                                <i class="iconfont">&#xe61d; </i>{{item.read_total}}
                            </el-col>
                            <el-col :span="2">
                                <i class="iconfont">&#xe6d3; </i>{{item.comment_total}}
                            </el-col>
                        </el-row>
                    </div>
                    </div>
                </el-card>
            </div>
        </div>
        <div id="right">
            <div id="blogger">
                <el-card>
                    <el-row>
                      <el-col :span="4" v-if="blogger.blogger">
                        <el-avatar :src="blogger.blogger.head_img_url" fit="fit"></el-avatar>
                      </el-col>  
                      <el-col :span="18" style="line-height:38px;margin-left:2%;" v-if="blogger.blogger">
                          <span>{{blogger.blogger.username}}</span>
                      </el-col>  
                    </el-row>
                    <div style="margin-top:5%;font-size:13px;color:gray;margin-left:4%;">
                        <el-row>
                            <el-col :span="2">
                                <i class="iconfont">&#xe60a; </i>
                            </el-col>
                            <el-col :span="6">
                                点赞数：
                            </el-col>
                            <el-col :span="8">
                                {{blogger.like_total}}
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:4%">
                            <el-col :span="2">
                                <i class="iconfont">&#xe61d; </i>
                            </el-col>
                            <el-col :span="6">
                                浏览数：
                            </el-col>
                            <el-col :span="8">
                                {{blogger.read_total}}
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:4%">
                            <el-col :span="2">
                                <i class="el-icon-tickets"></i>
                            </el-col>
                            <el-col :span="6">
                                博文数：
                            </el-col>
                            <el-col :span="8">
                                {{blogger.blog_total}}
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:4%">
                            <el-col :span="2">
                                <i class="el-icon-user"></i>
                            </el-col>
                            <el-col :span="6">
                                粉丝数：
                            </el-col>
                            <el-col :span="8">
                                {{blogger.fans_total}}
                            </el-col>
                        </el-row>
                        <!-- <el-row style="margin-top:4%">
                            <el-col :span="2">
                                <i class="el-icon-medal"></i>
                            </el-col>
                            <el-col :span="6">
                                排行榜：
                            </el-col>
                            <el-col :span="8">
                                1
                            </el-col>
                        </el-row> -->
                        <div style="margin-top:4%">
                            <el-button type="primary" size="small" style="width:100%" @click="toBlogManage">进入我的博客主页</el-button>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>
<script>
import { getBlog, getBlogger } from '@/api/blog.js';
export default {
  name: 'blog',
  data () {
      return {
          detail: null,
          blog_type: 0,
          nav: true,
          blogger: {},
          blog_list: []
      }
  },
  created() {
      this.init()
  },
  methods: {
      init() {
          this.detail = JSON.parse(localStorage.getItem('detail'))
          this.getBlog()
          this.getBlogger()
      },
      getBlog () {
          var data = {
              query_type: this.blog_type,
              page: 1,
              page_size: 10
          }
          getBlog(data).then(response => {
              if (response.data.code === 0) {
                  this.blog_list = response.data.data.list
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      getBlogger () {
        getBlogger({blogger:this.detail.account_id}).then(response => {
              if (response.data.code === 0) {
                  this.blogger = response.data.data
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      getBlogDetail (item) {
          this.$router.push('/blog/' + item.id)
      },
      toBlogManage () {
          this.$router.push('/blog/manage')
      }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'iconfont';  /* project id 1306051 */
  src: url('//at.alicdn.com/t/font_1306051_svucwz6pwna.eot');
  src: url('//at.alicdn.com/t/font_1306051_svucwz6pwna.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.woff') format('woff'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.svg#iconfont') format('svg');
}
.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
#blog {
    height: auto;
    margin: 0% 10% 2% 20%;
}

.left {
    width: 70%;
    float: left;
}
#right {
    width: 30%;
    float: left;
}

#blog-type {
    margin-top: 3%;
    width: 89%;
}
#blog-list {
    margin-top: 3%;
    width: 89%;
}
</style>