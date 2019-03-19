sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(Controller, History, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("br.com.idxtecItemContabil.controller.GravarItem", {
		onInit: function(){
			var oRouter = this.getOwnerComponent().getRouter();
			
			oRouter.getRoute("gravaritem").attachMatched(this._routerMatch, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			this._operacao = null;
			this._sPath = null;
			
			var oJSONModel = new JSONModel();
			this.getOwnerComponent().setModel(oJSONModel,"model");
		},
		
		_routerMatch: function(){
			var oParam = this.getOwnerComponent().getModel("parametros").getData();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oModel = this.getOwnerComponent().getModel();
			
			this._operacao = oParam.operacao;
			this._sPath = oParam.sPath;
			
			if (this._operacao === "incluir"){
				var oNovoItem = {
					"Id": 0,
					"Codigo": "",
					"Descricao": "",
					"Condicao": "CREDORA",
					"Bloqueado": false
				};
				
			oJSONModel.setData(oNovoItem);
				
			} else if (this._operacao === "editar"){
				oModel.read(oParam.sPath,{
					success: function(oData) {
						oJSONModel.setData(oData);
					},
					error: function(oError) {
						MessageBox.error(oError.responseText);
					}
				});
			}
		},
		
		onSalvar: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (this._checarCampos(this.getView())) {
				MessageBox.information("Preencher todos os campos obrigatórios!");
				return;
			}
			
			if (this._operacao === "incluir") {
				this._createItem();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					oRouter.navTo("itemcontabil", {}, true);
				}
			} else if (this._operacao === "editar") {
				this._updateItem();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					oRouter.navTo("itemcontabil", {}, true);
				}
			}
		},
		
		_createItem: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			
			var oDados = oJSONModel.getData();

			oModel.create("/ItemContabils", oDados, {
				success: function() {
					MessageBox.success("Dados gravados.");
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_updateItem: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			
			var oDados = oJSONModel.getData();
			
			oModel.update(this._sPath, oDados, {
					success: function() {
					MessageBox.success("Dados gravados.");
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("descricao").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
		
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				oRouter.navTo("itemcontabil", {}, true);
			}
		}
	});

});