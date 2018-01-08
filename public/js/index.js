$(function(){
	var $loginBox=$("#login");

	var $registBox=$("#logout");

	var $userInfo=$("#user-info");

    $loginBox.find(".regist").click(function(){
        $loginBox.hide();
        $registBox.show();
	})

	$registBox.find("a.login").click(function () {
        $loginBox.show();
        $registBox.hide();
    })

	$registBox.find("button").click(function(){
		$.ajax({
            type:'post',
			url:"api/user/register",
			data:{
				username:$registBox.find("[name='username']").val(),
				password:$registBox.find("[name='password']").val(),
				repassword:$registBox.find("[name='password2']").val()
			},
			dataType:"json",
			success:function(response){
				$(".register-message").text(response.message);
                window.location.reload();
			}
		})
	})

    $loginBox.find("button").click(function(){
    	$.ajax({
			url:"api/user/login",
			type:"post",
			data:{
				username:$loginBox.find("[name='username']").val(),
				password:$loginBox.find("[name='password']").val()
			},
			dataType:"json",
			success:function(response){
				if(response.code){
					$(".login-message").text(response.message);
				}else{
                    window.location.reload();
				}
			}
		})
	})

    $userInfo.find(".logout").click(function () {
		$.ajax({
			url:"/api/user/logout",
			success:function(){
				window.location.reload();
			}
		})
    })
})