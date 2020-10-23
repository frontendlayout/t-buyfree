"use strict";

import Swiper from 'swiper';

export const swiperController = new (function () {
    let _this = this;
    _this.name = "swiperSlider";
    _this.swiperSlider = null;
    
    _this.defaultSett = {
        default: {},
        product: {
            slidesPerView: 'auto',
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            mousewheel: true,
            keyboard: true
        }
    };

    _this.mergeObjects = function ({ firstObj = {}, lastObj = {} }) {
        for ( let prop in lastObj ) {
            try {
                if ( lastObj[ prop ].constructor == Object ) {
                    firstObj[ prop ] = _this.mergeObjects( firstObj[ prop ], lastObj[ prop ] );
                }
                else {
                    firstObj[ prop ] = lastObj[ prop ];
                }
            }
            catch( e ) {
                firstObj[ prop ] = lastObj[ prop ];
            }
        }
        return firstObj;
    };
    
    _this.init = function ({ swiperDom = false, settName = 'default', addSett = {} }) {
        if ( !swiperDom ) return;
        let setSett = {};
        if ( _this.defaultSett.hasOwnProperty(settName) ) {
            setSett = _this.mergeObjects({ firstObj: _this.defaultSett[settName], lastObj: addSett });
        }
        else {
            setSett = addSett;
        }
        _this.swiperSlider = new Swiper( swiperDom, setSett );
    };

})();
