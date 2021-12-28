<template>
    <div id="blog_manage" style="height:100%">
        <div id="tabs">
             <el-tabs tab-position="left" type="border-card" style="height:640px;">
                <el-tab-pane label="标签管理" style="height:600px;overflow:auto;">
                    <div>
                        <el-button type="primary" size="small" @click="tagVisible = true">添加新标签</el-button>
                    </div>
                    <div style="margin-top:2%" v-if="tags">
                        <el-card class="box-card" v-for="item in tags" :key="item" style="margin-top:1%">
                          <el-button type="danger" size="mini" style="margin-right:2%;" @click="delTag(item)">删除</el-button>
                          <span style="font-size:14px;">{{item}}</span>
                        </el-card>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="类别管理" style="height:600px;overflow:auto;">
                    <div>
                        <el-button type="primary" size="small" @click="categoryVisible = true">添加新类别</el-button>
                    </div>
                    <div style="margin-top:2%" v-if="tags">
                        <el-card class="box-card" v-for="item in categories" :key="item" style="margin-top:1%">
                          <el-button type="danger" size="mini" style="margin-right:2%;" @click="delCategory(item)">删除</el-button>
                          <span style="font-size:14px;">{{item}}</span>
                        </el-card>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="文章管理">角色管理</el-tab-pane>
                <el-tab-pane label="我的粉丝">定时任务补偿</el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog
            title="添加新标签"
            :visible.sync="tagVisible"
            width="30%">
            <el-form label-width="90px">
                <el-form-item label="新标签：">
                    <el-input v-model="tag" style="width:70%;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tagVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTag">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="添加新类别"
            :visible.sync="categoryVisible"
            width="30%">
            <el-form label-width="90px">
                <el-form-item label="新类别：">
                    <el-input v-model="category" style="width:70%;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="categoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCategory">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getTag, getCategory, addTag, delTag, addCategory, delCategory} from '@/api/blog.js';
export default {
  name: 'blog_manage',
  data () {
      return {
        detail: {},
        tags: [],
        categories: [],
        tagVisible: false,
        tag: '',
        categoryVisible: false,
        category: ''
      }
  },
  created() {
      this.init()
  },
  methods: {
      init () {
        this.detail = JSON.parse(localStorage.getItem('detail'))
        this.getTags()
        this.getCategory()
      },
      getTags () {
          getTag().then(response => {
              if (response.data.code === 0) {
                  this.tags = response.data.data.tags
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      getCategory () {
          getCategory().then(response => {
              if (response.data.code === 0) {
                  this.categories = response.data.data.categories
              } else {
                  this.$message.error('请求失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      addTag () {
          this.tagVisible = false
          addTag({tag:this.tag}).then(response => {
              if (response.data.code === 0) {
                  this.$message.success('添加成功')
                  this.getTags()
              } else {
                  this.$message.error('添加失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      delTag (tag) {
          delTag(tag).then(response => {
              if (response.data.code === 0) {
                  this.$message.success('删除成功')
                  this.getTags()
              } else {
                  this.$message.error('添加失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      addCategory () {
          this.categoryVisible = false
          addCategory({category:this.category}).then(response => {
              if (response.data.code === 0) {
                  this.$message.success('添加成功')
                  this.getCategory()
              } else {
                  this.$message.error('添加失败')
              }
          }).catch(error => {
              console.log(error)
              this.$message.error('请求错误')
          })
      },
      delCategory (category) {
          delCategory(category).then(response => {
              if (response.data.code === 0) {
                  this.$message.success('删除成功')
                  this.getCategory()
              } else {
                  this.$message.error('添加失败')
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
#tabs {
    margin: 1% 12%;
    height: 100%;
}
</style>