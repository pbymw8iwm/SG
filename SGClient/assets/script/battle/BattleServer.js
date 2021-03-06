/*
 Author: YeXiao
 Date: 2018-05-01
 Info: 战斗联网类
*/

var BattleServer = function (controler) {
	const HandleType = SG.Fight.HandleType;
	var _controler = controler;
	var _idx = 0;//操作的序列数
	// 资源加载完成{uid:用户id}
	this.sendLoadResComplete = function (args) {
		args.t = HandleType.resCmpl;
		this.sendOneHandle(args);
	};
	// {t:操作类型type h:上阵hid p:上阵位置pos,c:阵营camp}
	this.sendUpHero = function (args) {
		args.t = HandleType.upHero;
		this.sendOneHandle(args);
	};
	// {p:攻击角色位置，c:阵营camp}
	this.sendHeroAttack = function (args) {
		args.t = HandleType.heroAtk;
		this.sendOneHandle(args);
	}
	// 发送一条操作数据
	this.sendOneHandle = function (args) {
		var msg = SG.SGArray.deepCopy(args);
		msg.frame = _controler.frame;//这个是为了当网络回来的时候，重新赋值frame保证双端同步
		msg.idx = _idx;
		if (SG.BattleControler.checkIsPve()) {
			// SG.LogsControler.dump(msg,"===msg===:");
			// 如果是单人战斗，则原封不动的返回
			_controler.handle.receiveOneHandle(msg);
		}else{
			if (!SERVICE_DUMMY) {
				// websocket发送操作
                var params = {info:msg,t:SG.Fight.MsgType.handle};
                if (args.t == HandleType.resCmpl) {
                	params.t = SG.Fight.MsgType.resComplete;//资源加载完成的操作不一样
                };
                window.G_WS.send(JSON.stringify(params));
			}
		}
		_idx += 1;//每发送一条操作序列，序列号都会自增
	}
};
module.exports = BattleServer;