<template>
    <div id="blog_content">
        <div class="left">
            <div id="blog-panel">
                <el-card style="height:auto;">
                    <div style="font-size:18px;font-weight:600px;text-align:center">
                        {{blog.title}}
                    </div>
                    <div style="text-align:center;margin-top:2%;">
                        <el-avatar :src="detail.head_img_url" fit="fit"></el-avatar>
                    </div>
                    <div style="font-size:13px;color:gray;margin-top:1%;text-align:center">
                        作者：{{blog.blogger}}
                    </div>
                    <div class="markdown-body" style="font-size:14px;margin-top:2%;">
                       <VueMarkdown :source="blog.content"></VueMarkdown>
                    </div>
                    <div style="font-size:14px;color:gray;margin-top:2%;text-align:right;margin-right:2%;">
                        <span style="margin-right:2%">
                            <i class="iconfont">&#xe60a; </i>点赞 {{blog.like_total}}
                        </span>
                        <span style="margin-right:2%;">
                            <i class="iconfont">&#xe61d; </i>阅读 {{blog.read_total}}
                        </span>
                        <span>
                            <i class="iconfont">&#xe6d3; </i>评论 {{blog.comment_total}}
                        </span>
                    </div>
                     <el-divider></el-divider>
                     <div>
                         <el-row>
                             <el-col :span="2">
                                <el-avatar :src="detail.head_img_url" fit="fit"></el-avatar>
                             </el-col>
                             <el-col :span="22">
                                 <el-input type="textarea" rows="3" placeholder="觉得这篇博文好吗，留下你的评论吧"></el-input>
                             </el-col>
                         </el-row>
                         <div style="text-align:right;margin-top:2%">
                             <el-button type="primary" size="small">发表评论</el-button>
                         </div>
                     </div>
                    <el-divider></el-divider>
                    <div style="font-weight:500px;color:#1d2129">
                        <label>全部评论</label>
                    </div>
                    <div>
                        <el-empty description="还没有沙发" :image-size="70"></el-empty>
                    </div>
                </el-card>
            </div>
        </div>
        <div id="right">
            <div id="blogger">
                <el-card>
                    <el-row>
                      <el-col :span="4">
                        <el-avatar :src="blogger.head_img_url" fit="fit"></el-avatar>
                      </el-col>  
                      <el-col :span="18" style="line-height:38px;margin-left:2%;">
                          <span>{{blogger.username}}</span>
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
                            <el-button type="primary" size="small" style="width:100%">进入我的博客主页</el-button>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>
<script>
import { getBlogger, getBlogDetail } from '@/api/blog.js'
import VueMarkdown from 'vue-markdown'
// import 'github-markdown-css/github-markdown.css'
export default {
  name: 'blog_content',
  components: {
      VueMarkdown
  },
  props: ['blog_id'],
  data () {
      return {
        blogger: {},
        blog: {},
        detail: {}
      }
  },
  mounted() {
      this.init()
  },
  methods: {
      init() {
          this.detail = JSON.parse(localStorage.getItem('detail'))
          this.getBlogDetail()
          this.getBlogger()
      },
      async getBlogDetail () {
          await getBlogDetail({blog_id:this.blog_id}).then(response => {
              if (response.data.code === 0) {
                  this.blog = response.data.data
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      getBlogger () {
        getBlogger({blogger:this.blog.blogger}).then(response => {
              if (response.data.code === 0) {
                  this.blogger = response.data.data
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
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
#blog_content {
    height: auto;
    margin: 0% 10% 2% 20%;
    bottom: 0;
}

.left {
    width: 70%;
    height: auto;
    float: left;
}
#right {
    width: 30%;
    float: left;
}

#blog-panel {
    width: 89%;
    height: auto;
}
</style>