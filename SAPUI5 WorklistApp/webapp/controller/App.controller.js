sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/ui/core/Fragment",
   "sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],  function (Controller, Fragment, JSONModel, MessageToast, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("SAPUI5 WorkListApp.controller.App", {
      // onInit é quando inicia a pagina
      onInit : function () {
         // Dados iguais aos do .json por isso não é necessario ter nada no manifest
         // no futuro iremos substituir isto por uma conexao a base de dados
         var students = [{
            "Name": "João Claudio",
            "Year": "11",
            "Class": "2ºPSI",
            "Number": 10,
            "School": "Raul Proença"
         },

         {
            "Name": "Tomás Félix",
            "Year": "11",
            "Class": "2ºPSI",
            "Number": 23,
            "School": "Raul Proença"
         }];

         // Criamos o modelo de dados
         var oModel = new sap.ui.model.json.JSONModel();

         // e igualamos aos dados
         oModel.setData({
            students
         });

         this.getView().setModel(oModel);
		},

      // Botão para adicionar o aluno Teste            
      addStudent : function ()
      {
         // Vamos buscar o modelo de dados
         var oModel = this.getView().getModel();

         // Equalamos o oData ao modelo
         var oData = oModel.getData();                                                                                                                 
         
         // Equalamos os students ao oData
         var students = oData.students;
         
         // Adicionamos um novo student no final do array (push)
         students.push({
            "Name": "teste",
            "Year": "teste",
            "Class": "teste",
            "Number": 0,
            "School": "teste"
         })

         // igualamos os students aos dados
         oModel.setData({
            students : students,
            newstudent :  {}
         });

         this.getView().setModel(oModel);
      },

      // Botão para adicionar e preencher um aluno
      openDialog : function ()
      {
         if (!this.pDialog) {

				this.pDialog = this.loadFragment({
					name: "SAPUI5 WorkListApp.view.StudentsDialog"
				});
			} 
         var oModel = this.getView().getModel();
         var oData = oModel.getData();         
         var students = oData.students;

         var newstudent = {
            "Name": "teste",
            "Year": "teste",
            "Class": "teste",
            "Number": 1,
            "School": "D.João II"
         };

         oModel.setData({
            students : students,
            newstudent : newstudent
         });

         this.getView().setModel(oModel);
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});

      },

      // Botão para confirmar o novo aluno
      confirmStudent : function ()
      {
         var oModel = this.getView().getModel();
         var oData = oModel.getData();
         var students = oData.students;
         var newstudent = oData.newstudent;

         students.push(newstudent);
         
         var oData = oModel.getData();
         
         var students = oData.students;

         oModel.setData({
            students : students,
            newstudent :  newstudent
         });

         this.getView().setModel(oModel);

         var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("msg1",[sRecipient]);
         MessageToast.show(sMsg);

         this.pDialog.then(function(oDialog) {
				oDialog.close();
			});
         
      },
      closeDialog : function (){
         
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("msg2", [sRecipient]);
         MessageToast.show(sMsg);

		   this.pDialog.then(function(oDialog) {
				oDialog.close();
			});
      },
      closeDialog2 : function (){
         
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("msg2", [sRecipient]);
         MessageToast.show(sMsg);

		   this.editDialog.then(function(eDialog) {
				eDialog.close();
			});
      },
      editStudent : function(){

         if (!this.editDialog) {

				this.editDialog = this.loadFragment({
					name: "SAPUI5 WorkListApp.view.ChangeStudent"
				});

			}
         var oModel = this.getView().getModel();
         var oData = oModel.getData();         
         var selectedstudent = oData.students;
        
         var e = {path: '/student'}

         var selectedstudent = {
            e
         };

         oModel.setData({
            selectedstudent: selectedstudent
         });

         this.getView().setModel(oModel);

         this.editDialog.then(function(eDialog) {
				eDialog.open();
			});

      },
      delStudent: function(){


         var oModel = this.getView().getModel();
         var oData = oModel.getData();
         var students = oData.students;

         students.splice(0, 1); 

         oModel.setData({
            students : students,
            newstudent : {}
         });

         this.getView().setModel(oModel);
      
      },
      onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("Name", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("idList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},

		onSelectionChange: function (oEvent) {
			var oList = oEvent.getSource();
			var oLabel = this.byId("idFilterLabel");
			var oInfoToolbar = this.byId("idInfoToolbar");

			// With the 'getSelectedContexts' function you can access the context paths
			// of all list items that have been selected, regardless of any current
			// filter on the aggregation binding.
			var aContexts = oList.getSelectedContexts(true);

			// update UI
			var bSelected = (aContexts && aContexts.length > 0);
			var sText = (bSelected) ? aContexts.length + " selected" : null;
			oInfoToolbar.setVisible(bSelected);
			oLabel.setText(sText);
		}
   });
});