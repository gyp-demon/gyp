angular.module('app',[])
	.directive('tabHeader',function(){
		return {
			template:`<header class="header">
				<a href="#"><返回</a>
				<h3>{{dishes}}</h3>
				<a href="#">---</a>
			</header>`,
			scope:{
				dishes:'='
			}
		}
	})
	.directive('tabContent',function($timeout){
		return {	
			replace:true,
			template:`<div class="content">
				<ul class="left">
					<li ng-repeat="i in data" index="{{$index}}" ng-click="fn($index)">{{i.cuisine}}</li>
				</ul>
				<tab-right opt="data"></tab-right>
			</div>`,
			scope:{
				data:'='
			},
			controller:function($scope){
				$scope.fn = function(ind){
					$scope.$broadcast('listindex',ind)
				}
			},
			link:function(scope,eve){	
				function listIndex(ind){
					eve.find('li').removeClass('bg').eq(ind).addClass('bg');
				}
				$timeout(function(){
					listIndex(0)
					eve.find('li').on('click',function(){
						if(this.getAttribute('index')){
							var ind = this.getAttribute('index');
							listIndex(ind);	
						}	
					})
				},100)
			}
		}
	})
	.directive('tabRight',function(){
		return {
			replace:true,	
			template:`<ul class="right">
					<li ng-repeat="v in opt[index].list">
						<div class="title">
							<p>{{v.name}}</p>
							<p>{{v.price|currency:'$'}}</p>
						</div>
						<tab-radio data="v.name"></tab-radio>
					</li>
				</ul>`,
			scope:{
				opt:'='
			},
			controller:function($scope){
				$scope.index = 0;
				$scope.$on('listindex',function(e,opt){
					$scope.index = opt;
				})								
			}
		}
	})
	.directive('tabRadio',function(){
		return {
			replace:true,
			template:`<div class="radio" ng-class="{true:'rad1',false:'rad2'}[isrd]" ng-click="fn()"></div>`,
			controller:function($scope,num){
				$scope.isrd = num.radios[$scope.data];
				$scope.fn = function(){
					num.radios[$scope.data] = !num.radios[$scope.data];
					$scope.isrd = num.radios[$scope.data];
					num.sum = num.radios[$scope.data] ? num.sum + 1 :num.sum-1;
					$scope.$emit('sum',num.sum);
				}
			},
			scope:{
				data:'='
			}
		}
	})
	.controller("mytab",function($scope,$http,num){
		$http.get('data/data.json').success(function(opt){
			$scope.data = opt;
		})
			$scope.$on('sum',function(e,opt){
				$scope.sum = opt;			
			});$scope.sum = num.sum;
	})
	.value('num',{
		sum:0,
		radios:{}
	})

