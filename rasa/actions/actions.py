# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


import datetime as dt
from typing import Any, Text, Dict, List
from urllib import response
from aiohttp import request
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict
from rasa_sdk.events import AllSlotsReset, SlotSet
import requests
import logging

genres_dict = {
    "Abenteuer": "Adventure",
    "Belletristik": "Fiction",
    "Drama": "Drama",
    "Erwachsene": "Adult",
    "Fantasy Bücher": "Fantasy",
    "Historisch": "Historical",
    "Horror": "Horror",
    "Horrorbücher": "Horror",
    "Kinder": "Kids",
    "Kinderbücher": "Kids",
    "Liebe": "Love",
    "Literatur": "Literature",
    "Mythologie": "Mythology",
    "Märchen": "Fairy Tales",
    "Märchenbücher": "Fairy Tales",
    "Philosophie": "Philosophy",
    "Politik": "Politics",
    "Psychologie": "Psychology",
    "Religion": "Religion",
    "Romane": "Novels",
    "Romantik": "Romance",
}

languages_dict = {
    "Arabisch": "Arabic",
    "Bulgarisch": "Bulgarian",
    "Chinesisch": "Chinese",
    "Deutsch": "German",
    "Englisch": "English",
    "Französisch": "French",
    "Indonesisch": "Indonesian",
    "Italienisch": "Italian",
    "Japanisch": "Japanese",
    "Niederländisch": "Dutch",
    "Norwegisch": "Norwegian",
    "Persisch": "Persian",
    "Polnisch": "Polish",
    "Portugiesisch": "Portuguese",
    "Rumänisch": "Romanian",
    "Russisch": "Russian",
    "Spanisch": "Spanish",
    "Türkisch": "Turkish",
    "Urdu": "Urdu",
}


class ValidateOrderingForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_ordering_form"

    def validate_user_email(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate user_email value."""

        if "@" in slot_value:
            # validation succeeded, set the value of the "user_email" slot to value
            return {"user_email": slot_value}
        else:
            # validation failed, set this slot to None so that the
            # user will be asked for the slot again
            dispatcher.utter_message(
                text="Bitte geben Sie eine korrekte Email Adresse an damit wir Ihre Bestellung korrekt zuordnen können."
            )
            return {"user_email": None}

    def validate_user_plz(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate user_plz value."""
        # PLZ should be exactly five characters long and only contain numbers
        if len(slot_value) != 5 or not slot_value.isdecimal():
            # validation failed, set this slot to None so that the
            # user will be asked for the slot again
            dispatcher.utter_message(
                text="Es scheint ein Tippfehler vorzuliegen, bitte achten Sie darauf eine 5-stellige ausschließlich aus Ziffern bestehende Postleitzahl eingeben."
            )
            return {"user_plz": None}

        else:
            # validation succeeded, set the value of the "user_plz" slot to value
            return {"user_plz": slot_value}


class OrderAction(Action):
    def name(self) -> Text:
        return "action_order"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        book = tracker.get_slot("book")
        email = tracker.get_slot("user_email")
        user_name = tracker.get_slot("person")
        user_street = tracker.get_slot("user_street")
        user_plz = tracker.get_slot("user_plz")
        user_city = tracker.get_slot("user_city")

        response_books = requests.get(
            "http://backend:8000/books", params={"title": str(book)}
        )
        response_books = response_books.json()
        books = response_books["list"]

        isbn = books[0]["isbn"]

        response_order = requests.post(
            "http://backend:8000/orders",
            params={
                "name": user_name,
                "street": user_street,
                "plz": user_plz,
                "city": user_city,
                "email": email,
                "isbn": int(isbn),
            },
        ).json()

        order = response_order["application/json"][0]
        order_number = order["id"]

        dispatcher.utter_message(
            response="utter_confirm_order",
            book=book,
            user_city=user_city,
            order_number=order_number,
        )

        return [SlotSet("book", None)]


def convert_to_carousel(book):
    return {
        "title": book["title"],
        "subtitle": str(book["price"]) + " €",
        "image_url": book["coverImg"],
        "buttons": [
            {
                "title": "ausleihen",
                "payload": '/ack_book_title{"book":"%s"}' % (book["title"]),
                "type": "postback",
            }
        ],
    }


class ExtractFiltersAction(Action):
    def name(self) -> Text:
        return "action_extract_filters"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        price = "-"
        genre = "-"
        author = "-"
        book_title = "-"
        language = "-"

        price_filters = {
            "unter": "<",
            "über": ">",
            "weniger": "<",
            "zwischen": "-",
            "ab": ">",
        }

        parameters = {}

        user_message = tracker.latest_message["text"]

        if list(tracker.get_latest_entity_values("PRICE")):
            prices = list(tracker.get_latest_entity_values("PRICE"))
            prices = [price.replace("€", "") for price in prices]
            words_in_user_message = user_message.split(" ")
            for price_filter in price_filters.keys():
                if price_filter in words_in_user_message:
                    if len(prices) == 1:
                        parameters[
                            "price"
                        ] = f"{price_filters[price_filter]}{prices[0]}"
                    elif len(prices) == 2:
                        parameters[
                            "price"
                        ] = f"{prices[0]}{price_filters[price_filter]}{prices[1]}"
                    break
                else:
                    parameters["price"] = prices[0]
        if list(tracker.get_latest_entity_values("GENRE")):
            genre = list(tracker.get_latest_entity_values("GENRE"))[0]
            parameters["genres"] = genre
        if list(tracker.get_latest_entity_values("PERSON")):
            author = list(tracker.get_latest_entity_values("PERSON"))[0]
            parameters["author"] = author
        if list(tracker.get_latest_entity_values("WORK_OF_ART")):
            book_title = list(tracker.get_latest_entity_values("WORK_OF_ART"))[0]
            parameters["title"] = book_title
        dispatcher.utter_message(
            response="utter_filter_entities",
            author=author,
            price=parameters["price"] if "price" in parameters else "",
            genre=genre,
            language=language,
        )

        return_list = []
        if author != "-":
            return_list.append(SlotSet("author", author))
        if "price" in parameters and parameters["price"] != "-":
            return_list.append(
                SlotSet("price", parameters["price"]),
            )
        if genre != "-":
            return_list.append(SlotSet("genre", genre))
        if book_title != "-":
            return_list.append(SlotSet("book", book_title))
        if language != "-":
            return_list.append(SlotSet("language", language))

        return return_list


class FilterAction(Action):
    def name(self) -> Text:
        return "action_filter"

    def run(
        self,
        dispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        price_filters = {
            "unter": "<",
            "über": ">",
            "weniger": "<",
            "zwischen": "-",
            "ab": ">",
        }

        parameters = {}
        user_message = tracker.latest_message["text"]
        if tracker.get_slot("price"):
            parameters["price"] = tracker.get_slot("price")
        elif list(tracker.get_latest_entity_values("PRICE")):
            prices = list(tracker.get_latest_entity_values("PRICE"))
            prices = [price.replace("€", "") for price in prices]
            prices = [price.replace("Euro", "") for price in prices]
            words_in_user_message = user_message.split(" ")
            for price_filter in price_filters.keys():
                if price_filter in words_in_user_message:
                    if len(prices) == 1:
                        parameters[
                            "price"
                        ] = f"{price_filters[price_filter]}{prices[0]}"
                    elif len(prices) == 2:
                        parameters[
                            "price"
                        ] = f"{prices[0]}{price_filters[price_filter]}{prices[1]}"
                    break
                else:
                    parameters["price"] = prices[0]

        if tracker.get_slot("genre"):
            parameters["genres"] = genres_dict[tracker.get_slot("genre")]
        elif list(tracker.get_latest_entity_values("GENRE")):
            genre = list(tracker.get_latest_entity_values("GENRE"))[0]
            if genre in genres_dict:
                parameters["genres"] = genres_dict[genre]

        if tracker.get_slot("author"):
            parameters["author"] = tracker.get_slot("author")
        elif list(tracker.get_latest_entity_values("PERSON")):
            author = list(tracker.get_latest_entity_values("PERSON"))[0]
            parameters["author"] = author

        if tracker.get_slot("book"):
            parameters["title"] = tracker.get_slot("book")
        elif list(tracker.get_latest_entity_values("WORK_OF_ART")):
            book_title = list(tracker.get_latest_entity_values("WORK_OF_ART"))[0]
            parameters["title"] = book_title

        if tracker.get_slot("language"):
            lang = tracker.get_slot("language")
            if lang in languages_dict:
                parameters["language"] = languages_dict[lang]

        parameters["limit"] = 5

        response_books = requests.get(
            "http://backend:8000/books",
            params=parameters,
        ).json()

        response_books = response_books["list"]

        carousel = {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": list(map(convert_to_carousel, response_books)),
            },
        }

        dispatcher.utter_message(attachment=carousel)
        # dispatcher.utter_message(
        #     buttons=[
        #         {
        #             "payload": '/ack_book_title{"book":"%s"}'
        #             % (response_books[0]["title"]),
        #             "title": f"{response_books[0]['title']} ausleihen",
        #         },
        #         {
        #             "payload": '/ack_book_title{"book":"%s"}'
        #             % (response_books[1]["title"]),
        #             "title": f"{response_books[1]['title']} ausleihen",
        #         },
        #         {
        #             "payload": '/ack_book_title{"book":"%s"}'
        #             % (response_books[2]["title"]),
        #             "title": f"{response_books[2]['title']} ausleihen",
        #         },
        #     ]
        # )
        return []


class GetOrderInformationAction(Action):
    def name(self) -> Text:
        return "action_get_order_information"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        SlotSet("order_status", "-")

        order_number = tracker.latest_message["text"]

        response_order = requests.get(
            "http://backend:8000/orders",
            params={"id": order_number},
        ).json()

        if response_order:
            order = response_order[0]
            order_status = order["state"]

            return [SlotSet("order_status", order_status)]

        else:
            return [SlotSet("order_status", "Bestellung nicht vorhanden")]


class Order_chosen_book(Action):
    def name(self) -> Text:
        return "action_order_chosen_book"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="hello from action_order_chosen_book")

        return []


class SetBookSlot(Action):
    def name(self) -> Text:
        return "action_set_book_slot"

    def run(
        self,
        book,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        [SlotSet("book", book)]
