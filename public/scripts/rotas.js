/**
 * Created by Osvaldo/Gustavo on 22/10/15.
 */

function ConfigRotas($routeProvider) {
    var me = this;
    me.route = $routeProvider;

    me.rotas = {};

    me.wiring = function(){

        me.route.when('/', {templateUrl: '../views/home.html', controller: 'homeController'});
        SIOM.on('setarota', me.setaRota.bind(me));
    };

    me.incluiRota = function(){
        me.rotas['/home'] = {templateUrl: '../views/home.html', controller: 'homeController'};
    };

    me.setaRota = function(tipoUser){
        if(tipoUser != undefined){
            me.incluiRota();
        }

        for(var name in me.rotas){
            me.route.when(name, me.rotas[name]);
        }
        
        SIOM.emit('rotasetada');
    };

    me.wiring();
}

app.config(ConfigRotas);