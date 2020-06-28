<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="openAdd()">注册</el-button>
                </div>
                <div class="login-tips">
                    <input type="radio"  value="login" v-model="picked"/><label>用户</label>
                    <input type="radio" value="person" v-model="picked" style="margin-left:10px;"/><label>助研员</label>
                </div>
            </el-form>
        </div>

        <!-- 注册弹出框 -->
        <el-dialog :title="title" :visible.sync="open" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="学号" prop="userId">
                    <el-input v-model="form.userId"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="telephone">
                    <el-input v-model="form.telephone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="专业" prop="major">
                    <el-input v-model="form.major"></el-input>
                </el-form-item>
                <el-form-item label="班级" prop="clazz">
                    <el-input v-model="form.clazz"></el-input>
                </el-form-item>
                <el-form-item label="年级" prop="grade">
                    <el-input v-model="form.grade"></el-input>
                </el-form-item>
                <el-form-item prop="roleId">
                    <el-input v-model="form.roleId" type="hidden"/>
                </el-form-item>
                <el-form-item label="头像" prop="image" enctype="multipart/form-data">
                    <div class="crop-demo">
                        <img :src="cropImg" class="pre-img">
                        <div class="crop-demo-btn">选择图片
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="open = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
            <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import {addUser} from '@/api/page/user';
    import VueCropper  from 'vue-cropperjs';

    export default {
    data: function() {
        return {
            param: {
                username: 'admin',
                password: '123123',
            },
            defaultSrc: require('../../assets/img/img.jpg'),
            fileList: [],
            imgSrc: '',
            cropImg: '',
            dialogVisible: false,
            roleId: null,
            picked: '',
            form: {},
            //标题
            title: "",
            open: false,
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
        components: {
            VueCropper
        },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    if (this.picked == 'login'){
                    this.$store.dispatch("Login", this.param).then(() => {
                        this.$message.success('登录成功');
                        const roles = localStorage.getItem('roles');
                                if(roles === '1002'){
                                    this.$router.push({ path: this.redirect || "/technician" }, onComplete => { }, onAbort => { });
                                } else if (roles === '1003'){
                                    this.$router.push({ path: this.redirect || "/offices" }, onComplete => { }, onAbort => { })
                                } else if (roles == '1004'){
                                    this.$router.push({ path: this.redirect || "/student" })
                                } else
                                    this.$router.push({ path: this.redirect || "/" }, onComplete => { }, onAbort => { });
                    })
                    }else {
                        this.$store.dispatch("Persons", this.param).then(() => {
                            this.$message.success('Welcome to you');
                            this.$router.push({ path: this.redirect || "/person1" });
                        })
                    }
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        reset() {
            this.form = {
                userId: undefined,
                userName: undefined,
                telephone: undefined,
                password: undefined,
                email: undefined,
                clazz: undefined,
                grade: undefined,
                major: undefined
            }
        },

        openAdd() {
            this.reset();
            this.form.roleId = 1004;
            this.open = true;
            this.title = "欢迎学生注册"
        },
        setImage(e){
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                this.dialogVisible = true;
                this.imgSrc = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            this.form.image = file.name;
            reader.readAsDataURL(file);
        },
        cropImage () {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        cancelCrop(){
            this.dialogVisible = false;
            this.cropImg = this.defaultSrc;
        },
        created(){
            this.cropImg = this.defaultSrc;
        },

       handleAdd() {
           this.$refs["form"].validate(valid => {
               if (valid) {
                   addUser(this.form).then(response => {
                       if (response.code == 200) {
                           this.open = false;
                           this.getList();
                       }
                   });
               }
           })
       }
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.pre-img{
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo-btn{
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.crop-input{
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.crop-input{
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
.crop-demo{
    display: flex;
    align-items: flex-end;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
