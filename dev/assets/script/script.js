"use strict";

import { swiperController } from "./components/swiperController .js";

document.addEventListener("DOMContentLoaded", function () {

    const indexSwiperDom = document.querySelector( `.swiper-container` );
    const indexSwiperSett = {
        breakpoints: {
            576: {
                slidesPerView: 4
            },
            992: {
                slidesPerView: 5,
                spaceBetween: 15
            },
            1200: {
                slidesPerView: 6
            }
        }
    };
    const initSwiperController = swiperController.init({
        swiperDom: indexSwiperDom,
        settName: `product`,
        addSett: indexSwiperSett
    });

});