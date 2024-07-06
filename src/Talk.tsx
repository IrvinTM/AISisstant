import { useState } from "react";
const recognition = new window.webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang ="es-MX"
const messages:Message[] = [];
interface Message {
    role: string;
    content: string;
  }

export function Talk(){
    const [isListening, setIsListening] =  useState<boolean>(false);
    const [text, setText] = useState<string>("");

    async function getCompletions(){
        await fetch("https://nexra.aryahcr.cc/api/chat/gpt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages,
                prompt: text,
                model: "GPT-4",
                markdown: false
            })
        }).then((response) => {
            response.text().then((result) => {
                // Modify your code to remove the '_' at the end of the output
               const ob = JSON.parse(result)
               const currentMessage:Message = {
                role: "assistant",
                content: ob.gpt
               }
               const currentUserMessage:Message = {
                role: "user",
                content: text
               }
               messages.push(currentUserMessage)
               messages.push(currentMessage)
               
               setText("")
               const msg = new SpeechSynthesisUtterance(ob.gpt)
               const voices = window.speechSynthesis.getVoices()
               msg.voice =voices[2];
               window.speechSynthesis.speak(msg);
               console.log(ob.gpt)
               console.log(messages)
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    }



    function handleStartListening(){
             setIsListening(true);
             recognition.start();
             console.log("start talking bro")
             recognition.onresult = (event)=>{
                const response = Array.from(event.results)
                .map(element => element[0])
                .map(element=> element.transcript)
                .join("")
                setText(response)
             }

             
    }
function handleEndListening(){
        setIsListening(false)
        recognition.stop()
        console.log(text)
        getCompletions()

        
    }


    return(
        <div>
            <header>
                <h1 className="flex content-center justify-center text-4xl font-extrabold">GPT4 Assistant</h1>
            </header>
            <div className="flex justify-center items-center">
                <button
                onClick={isListening ? handleEndListening : handleStartListening}
                 className="h-80 w-80 bg-red-800 rounded-full mt-12">

                </button>
            </div>
        </div>
    )

}