<template>
    <div style="padding: 40px">
        <el-table :data="tableData" border>
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.date| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>姓名: {{ scope.row.name }}</p>
                        <p>住址: {{ scope.row.address }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑1
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="提示"
                :visible.sync="dialogVisible">
            <div>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="时间" prop="pass">
                        <el-input type="text" v-model="ruleForm.date" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="checkPass">
                        <el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="age">
                        <el-input v-model.number="ruleForm.address"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">重 置</el-button>
                <el-button type="primary" @click="submit('ruleForm')">提 交</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        // 接收传入组件的props参数
        props: [],
        // 组件局部数据
        data() {
            let tableData = [];

            for (let i = 0; i < 10; i++) {
                tableData.push({
                    date: +new Date(),
                    name: 'yizengyou' + i,
                    address: '广东省深圳市福田区金融中心' + i
                });
            }

            return {
                tableData: tableData,
                dialogVisible: false, //弹出框-编辑数据

                ruleForm: {
                    date: '',
                    name: '',
                    address: ''
                },
                rules: {
                    date: [
                        {required: true, message: '请选择活动区域', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请选择活动区域', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请选择活动区域', trigger: 'blur'}
                    ]
                }
            }
        },
        // 计算属性
        computed: {
            init() {
                return '计算值'
            }
        },
        // 事件
        methods: {
            /**
             * @param index 表格数据的数组下标
             * @param row 表格数组中的数据对象
             */
            handleEdit(index, row) {
                this.ruleForm = Object.assign({}, row) // 拷贝对象

                this.$nextTick(() => {
                    this.dialogVisible = true;
                })
            },
            //删除表格
            handleDelete(index, row) {
                console.log(index);
                console.log(row);
            },
            submit (formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        // 局部注册子组件
        components: {},
        // 组件生命周期-获取数据
        mounted() {

        }
    }
</script>

<style scoped>

</style>
