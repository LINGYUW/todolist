function check() {
	if(document.getElementById("account").value == "") {
		document.getElementById("account_tip").innerHTML = "请输入正确的账号";
		return false;
	}else if(document.getElementById("pass").value == ""){
		document.getElementById("pass_tip").innerHTML = "请输入合法的密码";
		return false;
	}
	return true;
}