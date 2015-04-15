/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global $:false */

'use strict';

$(document).ready(function() {
    //setQuestion();

    var audio = $('.audio').get(0),
    textArea = $('#textArea');

    var textChanged = false;
    var englishText = '';

    var temp = setQuestion();

    $('#voice').change(function(){
        if (!textChanged) {
            if ($(this).val() === 'VoiceEsEsEnrique')
                $('#textArea').val(spanishText);
            else
                $('#textArea').val(englishText);
        }
    });

    $('#textArea').change(function(){
        textChanged = true;
    });

    // IE and Safari not supported disabled Speak button
    if ($('body').hasClass('ie') || $('body').hasClass('safari')) {
        $('.speak-button').prop('disabled', true);
    }

    if ($('.speak-button').prop('disabled')) {
        $('.ie-speak .arrow-box').show();
    }

    $('.audio').on('error', function () {
        $('.result').hide();
        $('errorMgs').text('Error processing the request.');
        $('.errorMsg').css('color','red');
        $('.error').show();
    });

    $('.audio').on('loadeddata', function () {
        $('.result').show();
        $('.error').hide();
    });

    audio.onended = function() {
        //console.log("TTS audio.onended event executed - activate microphone" );
        $('.micButton').trigger("click");
    }

    $('.download-button').click(function() {
        textArea.focus();
        if (validText(textArea.val())) {
          window.location.href = '/api/watson-tts?download=true&' + $('.speech-form').serialize();
        }
    });

    $('.speak-button').click(function() {
        $('.result').hide();
        audio.pause();

        $('#textArea').focus();
        if (validText(textArea.val())) {
            audio.setAttribute('src','/api/watson-tts?' + $('.speech-form').serialize());
        }
    });

    $('#btnNext').click(function() {
        var temp = setQuestion();
    });

    function validText(text) {
        if ($.trim(text)) {
            $('.error').hide();
            return true;
        } else {
            $('.errorMsg').text('Please enter the text you would like to synthesize in the text window.');
            $('.errorMsg').css('color','#00b2ef');
            $('.error').show();
            return false;
        }
    }

    function setQuestion() {
        if(sessionStorage.isInteractive === "true") {
            switch($("#txtTtsQuestionIndex").val()) {
                case "1":
                    englishText = "Welcome to Cox Automotive Interactive.\n\n" +
                        "In this interactive mode, I will ask few questions to better assist you in finding your car. " +
                        "If you prefer to use a non-interactive mode, you may disable it at anytime by pressing the microphone icon below.  " +
                        "Please respond with Yes or No to these questions.     \n\n" +
                        "The first question, will price be one of the most important factors on your car purchase? \n\n";
                        ;
                    
                    //englishText = "is price important?";
                    /*englishText = "Welcome to Cox Automotive interactive mode.\n\n" + 
                        "I will ask few questions to better assist you in finding your car. " +
                        "Please respond with a Yes or No answer to these questions.\n\n" +
                        "The first question is, will price be one of the most important factors on your car purchase?";*/
                    break;

                case "2":
                    englishText = "Is fuel efficiency an important criteria for your next car?";
                    //englishText = "is fuel efficiency important?";
                    break;

                case "3": 
                    englishText = "How about the safety ratings of the car, will it affect your decision?";
                    //englishText = "is safety important?";
                    break;

                case "4": 
                    englishText = "Some cars have better performance than the others, such as acceleration, braking and car handling.\n" +
                        "Is this an important factor for you?";
                    //englishText = "is performance important?";
                    break;

                case "5":
                    englishText = "Our car inventory is classified under certain condition from 1 to 10, with 10 being in the best condition.\n" + 
                        "Is the condition of the car matters to you?";
                    //englishText = "is condition important?";
                    break;

                case "6":
                    englishText = "Each car have a comfort level score based on its seating, ride and quietness. Will that be a concern for you?";
                    //englishText = "is comfort important?";
                    break;

                case "7":
                    englishText = "Alright, I have one final question before I can present several car options for you. \n" +  
                        "We currently have several car types in our inventory, for examples, Sports Utility Vehicle, Sedan, Minivan or Hybrid.  " +  
                        "You can select more than one car types, and when you are done making your selection, you may click, or say Next to proceed.  " + 
                        "What would be the car types you are interested in?";
                    //englishText = "which car types?"
                    break;
            }
        }
            
        $("#textArea").val(englishText);
    }
    
    $("#textArea").val(englishText);
    $("#ttsSpeak").trigger("click");
});