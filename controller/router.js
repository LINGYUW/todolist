const formidable = require("formidable");
const dao = require("../success.js");

function getDate(callback) {
	let now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth() + 1;
	let day = now.getDate();
	if(month < 10) month = "0" + month;
	if(day < 10) day = "0" + day;
	callback({
		"year": year,
		"month": month,
		"day": day
	});
}

exports.Get_login = (request, response, next) => { 
	let tips = "";
	let tip = request.query.tip;
	if(tip == "1") tips = "用户名或密码错误";
	else if(tip == "2") tips = "是不是没事做了，还不赶紧登录看看还需要做什么";
	else if(tip == "3") tips = "您的登陆信息已经失效，请重新登陆";
	response.render("login", {
		"tips": tips
	});
}

exports.Post_login = (request, response, next) => { 
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log("表单解析失败");
			next();
			return;
		}
		let userName = fields.userName;
		let userPass = fields.userPass;
		let sql = "select * from login where userName = '" + userName + "' and userPass = '" + userPass + "'";
		dao.query(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			if(result.length == 0)
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/login?tip=1"
				});
			else {
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=2"
				});
				request.session.userName = userName;
			}
			response.end();
		});
	});
}

exports.Get_index = (request, response, next) => { //获取主页
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let list = 2;
	let re_list = request.query.list;
	if(re_list != null) list = parseInt(re_list);
	let sql = "select * from lists where type = 'child'";
	dao.query(sql, (err, left_result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		if(list == 1) {
			getDate((result) => {
				let time = result.year + "-" + result.month + "-" + result.day;
				sql = "select * from things where isdelete = 0 and time = '" + time + "' order by time asc";
			});
		} else if(list == 2) sql = "select * from things where isdelete = 0 order by time asc";
		else if(list == 3) sql = "select * from things where isdelete = 1 order by time asc";
		else sql = "select * from things where isdelete = 0 and list_id = " + list+" order by time asc";
		dao.query(sql, (err, right_result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.render("index", {
				"left": left_result,
				"right": right_result,
				"list_flag": list
			});
		});
	});
}

exports.Post_addThing = (request, response, next) => { //增加待办事项
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		let title = fields.title;
		let message = fields.message;
		let year = fields.year;
		let month = fields.month;
		let day = fields.day;
		if(month < 10) month = "0" + parseInt(fields.month);
		if(day < 10) day = "0" + parseInt(fields.day);
		let list_id = parseInt(request.query.list);
		let time = year + "-" + month + "-" + day;
		let sql = "insert into things values(null,?,?,?,0,?)";
		let params = [title, message, time, list_id];
		dao.add(sql, params, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=" + list_id
			});
			response.end();
		});
	});
}

exports.Get_deleteThing = (request, response, next) => { //标记完成跳转至垃圾桶
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	if(request.query.id == null) return;
	let id = parseInt(request.query.id);
	let list_id = request.query.list;
	let sql = "update things set isdelete = 1 where id=?";
	dao.update(sql, [id], (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list_id
		});
		response.end();
	});
}

exports.Get_removeThing = (request, response, next) => { //彻底删除某一事件
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	if(request.query.id == null) return;
	let id = parseInt(request.query.id);
	let list_id = request.query.list;
	let sql = "delete from things where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list_id
		});
		response.end();
	});
}

exports.Post_addList = (request, response, next) => { //增加列表的操作
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log("表单解析失败");
			next();
			return;
		}
		let listName = fields.listName;
		let sql = "insert into lists values(null,?,'child')";
		dao.add(sql, [listName], (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

exports.Get_deleteList = (request, response, next) => { //删除列表
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let id = request.query.id;
	let sql = "delete from lists where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		sql = "delete from things where list_id = " + id;
		dao.remove(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

//实现模糊匹配
exports.Post_search = (request, response, next) => { 
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	let form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err) {
			console.log("表单解析失败");
			next();
			return;
		}
		let listName = fields.search_title;
		let sql = "select * from lists where type = 'child'";
		dao.query(sql, (err, left_result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			sql = "select * from things where isdelete=0 and title like '%" + listName + "%' order by time asc";
			dao.query(sql, (err, right_result) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.render("index", {
					"left": left_result,
					"right": right_result,
					"list_flag": -1
				});
			});
		});
	});
}

