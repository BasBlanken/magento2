/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*global define*/
define(
    [
        'uiComponent',
        'Magento_GiftMessage/js/model/gift-message',
        'Magento_GiftMessage/js/model/gift-options',
        'Magento_GiftMessage/js/action/gift-options'
    ],
    function (Component, GiftMessage, giftOptions, giftOptionsService) {
        'use strict';
        return Component.extend({
            defaults: {
                isLoading: false
            },
            formBlockVisibility: null,
            resultBlockVisibility: null,
            model: {},
            /**
             * Component init
             */
            initialize: function () {
                var self = this,
                    model;
                this._super()
                    .observe('formBlockVisibility')
                    .observe('isLoading')
                    .observe({
                        'resultBlockVisibility': false
                    });
                this.itemId = this.itemId || 'orderLevel';
                model = new GiftMessage(this.itemId);
                model.observables = {
                    isLoading: this.isLoading
                };
                giftOptions.addOption(model);
                this.model = model;
                this.model.getObservable('isClear').subscribe(function (value) {
                    if (value == true) {
                        if (self.model.getObservable('message')() === null) {
                            self.resultBlockVisibility(false);
                            self.formBlockVisibility(true);
                        } else {
                            self.resultBlockVisibility(true);
                            self.formBlockVisibility(false);
                        }
                        self.model.getObservable('alreadyAdded')(true);
                    }
                    self.model.getObservable('isClear')(false)
                });

                this.isResultBlockVisible();
            },

            /**
             * Is result block visible
             */
            isResultBlockVisible: function () {
                var self = this;
                if (this.model.getObservable('alreadyAdded')()) {
                    this.resultBlockVisibility(true);
                }
                this.model.getObservable('additionalOptionsApplied').subscribe(function (value) {
                    if (value == true) {
                        self.resultBlockVisibility(true);
                    }
                });
            },
            /**
             * @param {String} key
             * @return {*}
             */
            getObservable: function (key) {
                return this.model.getObservable(key);
            },
            /**
             * Hide\Show form block
             */
            toggleFormBlockVisibility: function () {
                if (this.formBlockVisibility() || this.resultBlockVisibility()) {
                    this.formBlockVisibility(false);
                    this.resultBlockVisibility(false);
                } else {
                    if (!this.model.getObservable('alreadyAdded')()) {
                        this.formBlockVisibility(!this.formBlockVisibility());
                    } else {
                        this.resultBlockVisibility(!this.resultBlockVisibility());
                    }
                }
            },
            /**
             * Edit options
             */
            editOptions: function () {
                this.resultBlockVisibility(false);
                this.formBlockVisibility(true);
            },
            /**
             * Delete options
             */
            deleteOptions: function () {
                giftOptionsService(this.model, true);
            },
            /**
             * Hide form block
             */
            hideFormBlock: function () {
                this.formBlockVisibility(false);
                if (this.model.getObservable('alreadyAdded')()) {
                    this.resultBlockVisibility(true);
                }
            },
            /**
             * @return {Boolean}
             */
            hasActiveOptions: function () {
                var regionData = this.getRegion('additionalOptions'),
                    options = regionData();
                for (var i = 0; i < options.length; i++) {
                    if (options[i].isActive()) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * @return {Boolean}
             */
            isActive: function () {
                return this.model.isGiftMessageAvailable();
            },
            /**
             * Submit options
             */
            submitOptions: function () {
                giftOptionsService(this.model);
            }
        });
    }
);