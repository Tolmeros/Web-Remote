﻿using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace WebUI.Controllers
{
    public class ApiController : Controller
    {
        public class Message
        {
            public string username { get; set; }
            public string text { get; set; }
        }

        private static readonly ConcurrentQueue<StreamWriter> _streammessage = new ConcurrentQueue<StreamWriter>();


        // GET: PipeName
        //public ActionResult PipeName()
        //{
        //    return new ContentResult() { ContentType = "text/plain", Content = "ws://" + Request.Url.Host + ":" + Request.Url.Port + "/pipe.ashx" };
        //}


        /// <summary>
        /// When the user makes a GET request, 
        /// we’ll create a new HttpResponseMessage using PushStreamContent object 
        /// and text/event-stream content type. 
        /// PushStreamContent takes an Action&lt;Stream, HttpContentHeaders, TransportContext&gt; onStreamAvailable parameter in the constructor, and that in turn allows us to manipulate the response stream.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public HttpResponseMessage Get(HttpRequestMessage request)
        {
            Response.ContentType = "text/event-stream";
            //Response.Headers.Add("Connection", "Keep-Alive");
            do
            {

                Response.Write("data:" + JsonConvert.SerializeObject(new Message() { text = "text", username= "username" }) + "\n\n");
                Response.Flush();

                Thread.Sleep(1000);

            } while (true);
        }

        /// <summary>
        /// When the user makes a POST request, using model binidng we pull a 
        /// Message object out of the request and pass it off to MessageCallback
        /// </summary>
        /// <param name="m"></param>
        public void Post(Message m)
        {
            MessageCallback(m);
        }

        private static void MessageCallback(Message m)
        {
            foreach (var subscriber in _streammessage)
            {
                subscriber.WriteLine("data:" + JsonConvert.SerializeObject(m) + "n");
                subscriber.Flush();
            }
        }


    }






}
