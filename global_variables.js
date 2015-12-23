/* global $ */
/* global url */
/* global Mustache */
var App = {};
window.App = App;
window.template = function (name) { return Mustache.compile($("#" + name + "-template").html()); };
window.make_request = function make_request(data) { url = window.process_text_url; return $.post(url, { "text": data }) }
window.URL2 = "http://52.74.143.163:8080/";
// window.URL2 = "http://182.71.99.130:8000/";

//window.URL2= "http://ec2-54-68-29-37.us-west-2.compute.amazonaws.com:8080/"
window.get_start_date_for_restaurant = window.URL2 + "get_start_date_for_restaurant";
window.limited_eateries_list = window.URL2 + "limited_eateries_list";
window.get_word_cloud = window.URL2 + "get_word_cloud";
window.update_sentence = window.URL2 + "change_tag_or_sentiment";
window.resolve_query = window.URL2 + "resolve_query";
window.get_trending = window.URL2 + "get_trending";
window.nearest_eateries = window.URL2 + "nearest_eateries";
window.eatery_details = window.URL2 + "eatery_details";
window.eateries_on_character = window.URL2 + "eateries_on_character";
window.users_feedback = window.URL2 + "users_feedback";
window.users_details = window.URL2 + "users_details";
window.get_dish_suggestions = window.URL2 + "get_dish_suggestions";
window.get_eatery_suggestions = window.URL2 + "get_eatery_suggestions";
window.get_dishes = window.URL2 + "get_dishes";
window.get_eatery = window.URL2 + "get_eatery";

window.sentenceTokenization = window.URL2 + "sentence_tokenization";
window.uploadSentence = window.URL2 + "sentence_tokenization";

window.getReviewsList = window.URL2 + "get_reviews";
window.postReview = window.URL2 + "send_review";