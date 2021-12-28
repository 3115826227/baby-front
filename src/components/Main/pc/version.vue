<template>
    <div id="version">
        <el-card style="margin: 2% 18%;">
            <div style="margin:2%;font-weight:500px;font-size:18px;">版本迭代</div>
            <el-timeline reverse style="padding:0% 4%;">
                <el-timeline-item
                v-for="(version, index) in versions"
                :key="index"
                :timestamp="version.version" placement="top">
                    <el-card style="padding:0% 2%;">
                        <h4>{{version.content}}</h4>
                        <p style="color:gray;font-size:13px;text-align:right">更新于 {{timestampToTime(version.timestamp)}}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-card>
    </div>
</template>

<script>
import {getVersions} from '@/api/user.js';
export default {
    name: 'version',
    data () {
        return {
            versions: []
        }
    },
    created() {
        this.getVersions()
    },
    methods: {
        add0 (m) {
            return m < 10 ? '0' + m : m
        },
        timestampToTime (timestamp) {
            var time = new Date(timestamp * 1000)
            var y = time.getFullYear()
            var m = time.getMonth() + 1
            var d = time.getDate()
            var h = time.getHours()
            var mm = time.getMinutes()
            var s = time.getSeconds()
            return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s)
        },
        getVersions() {
            getVersions().then((response) => {
                if (response.data.code === 0) {
                    this.versions = response.data.data
                }
            }).catch((err) => {
                console.log(err)
            });
        }
    }
}
</script>