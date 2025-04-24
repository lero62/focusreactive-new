import plumber from "gulp-plumber"; // Обработка ошибок
import notify from "gulp-notify"; // Сообщение ошибки
import browsersync from "browser-sync"; // Сообщение ошибки
import newer from "gulp-newer"; // Проверка обновления
import ifPlugin from "gulp-if"; //Условное ветвление


export const plugins = {
	plumber: plumber,
	notify: notify,
	browsersync: browsersync,
	newer: newer,
	if: ifPlugin
}

