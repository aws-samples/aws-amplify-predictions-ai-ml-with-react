# AWS Amplify Predictions Library Sample 

***Language Translation and Syntax Tool Made With React Using AWS Amplify Predictions Library to Integrate Artificial Intelligence and Machine Learning***  


1. [Install CLI](#cli)
2. [Initialize App](#init)
3. [Auth](#auth)
4. [Predictions Library](#predictions)  
  • [Syntax](#syntax)  
  • [Translation](#translation)
5. [Hosting](#hosting)
6. [Sample App](#app)
7. [Security](#security)
8. [License](#license)


<a name="cli"></a>

### Install Amplify CLI
```
npm install -g @aws-amplify/cli
```

<a name="init"></a>

### Initialize Amplify App
```
amplify init
```
Fill out the form with the appropriate info for your app:
```
? Enter a name for the project (myApp)  

? Enter a name for the environment (dev)   

? Choose your default editor: (Use arrow keys)
❯ Visual Studio Code 
  Atom Editor 
  Sublime Text 
  IntelliJ IDEA 
  Vim (via Terminal, Mac OS only) 
  Emacs (via Terminal, Mac OS only) 
  None  

? Choose the type of app that you\'re building (Use arrow keys)
  android 
  ios 
❯ javascript  

? What javascript framework are you using (Use arrow keys)
  angular 
  ember 
  ionic 
❯ react 
  react-native 
  vue 
  none  

? Source Directory Path:  (src) 

? Distribution Directory Path: (build) 

? Build Command:  (npm run-script build) 

? Start Command: (npm run-script start) 
Using default provider  awscloudformation

? Do you want to use an AWS profile? (Y/n) 
```
After choosing how you want to authenticate with AWS, Amplify will create all the necessary resources to store your app in the cloud.  
*Note: See the `#amplify` section of `.gitignore` to see the paths to files with credential info that you can expect to see in the amplify directory but aren't present in this repo.*   Now it's time to add our services. For a full list of services you can add see the [Amplify docs](https://docs.amplify.aws/), but for our purposes we're just going to add a few.

<a name="auth"></a>

## Add Auth
```
amplify add auth

❯ Default configuration 
  Default configuration with Social Provider (Federation) 
  Manual configuration 
  I want to learn more. 

 Warning: you will not be able to edit these selections. 
 How do you want users to be able to sign in? (Use arrow keys)
❯ Username 
  Email 
  Phone Number 
  Email or Phone Number 
  I want to learn more. 

 Do you want to configure advanced settings? (Use arrow keys)
❯ No, I am done. 
  Yes, I want to make some additional changes. 
```

<a name="predictions"></a>

## Add AI/ML Predictions

<a name="syntax"></a>

### Syntax
```
amplify add predictions 

? Please select from one of the categories below 
  Identify #Identify text, labels, or entities (like celebrities) embedded within an image
  Convert #Convert from one language to another, convert text to speech, or convert speech to text
❯ Interpret #Interpret Text for Meaning, Sentiment, Idioms, Syntax, etc.
  Infer #Add Custom Models Using Sagemaker Endpoint 
  Learn More 

? What would you like to interpret? (Use arrow keys)
❯ Interpret Text 

# names must be alphanumeric
? Provide a friendly name for your resource (myinterpreter)

? What kind of interpretation would you like? 
  Language 
  Entity 
  Keyphrase 
  Sentiment 
  Syntax 
❯ All 

? Who should have access? (Use arrow keys)
  Auth users only 
❯ Auth and Guest users 
```
<a name="translation"></a>

### Translation
Now let's go back and add in our translate library

```
amplify add predictions

? Please select from one of the categories below 
  Identify 
❯ Convert 
  Interpret 
  Infer 
  Learn More 

? What would you like to convert? (Use arrow keys)
❯ Translate text into a different language 
  Generate speech audio from text 
  Transcribe text from audio 

? Provide a friendly name for your resource (mytranslator)

# For source and target language you're just choosing defaults, these can be overridden
? What is the source language? 
  Czech 
  Danish 
  Dutch 
❯ English 
  Finnish 
  French 
  German 
(Move up and down to reveal more choices)

? What is the target language? 
  Portuguese 
  Romanian 
  Russian 
❯ Spanish 
  Swedish 
  Thai 
  Turkish 
(Move up and down to reveal more choices)

? Who should have access? (Use arrow keys)
  Auth users only 
❯ Auth and Guest users 
```
Once your app is initialized, you can push updates to amplify services using the `amplify push` command.

*Note: `amplify push` will only update changes to amplify services, to update app code use `amplify publish` or Automatic Git deployments.*

```bash
amplify push
✔ Successfully pulled backend environment dev from the cloud.

Current Environment: dev

| Category    | Resource name             | Operation | Provider plugin   |
| ----------- | ------------------------- | --------- | ----------------- |
| Auth        | myApp                     | Create    | awscloudformation |
| Predictions | myinterpreter             | Create    | awscloudformation |
| Predictions | mytranslator              | Create    | awscloudformation |
? Are you sure you want to continue? Yes
```

Now the services are ready for use, but before we can access our app on the web, we have to add hosting.  

<a name="hosting"></a>

## Add Hosting
```
amplify add hosting

? Select the plugin module to execute (Use arrow keys)
❯ Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment) 
  Amazon CloudFront and S3 

? Choose a type (Use arrow keys)
  Continuous deployment (Git-based deployments) 
❯ Manual deployment 
  Learn more

You can now publish your app using the following command:

Command: amplify publish
```

*Note: Make sure you add all amplify files that have sensitive info in them to your gitignore before pushing to a public repo. To ensure security you can add the entire `amplify` directory to gitignore and then use `amplify pull` to get the necessary backend files before updating.*

Once you get the confirmation that hosting was added, you can publish to the web using `amplify publish`. Once the app is deployed you'll be shown the randomly assigned URL where you can find your app and confirm that the entire process worked.  
You can find instructions on how to use a custom domain with your app [here](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html).  

<a name="app"></a>

## Sample App - Language Translation and Syntax
*Note: The *Amplify* directory in this repo is for reference only and is missing some necessary files for security purposes. To run sample app remove current *amplify* directory and recreate it with the above tutorial*

Run app locally using `npm start` then navigating in browser to `localhost:3000`

Input text into the box on the left in the app and the AI will assess it for the following properties:

- ***Translation*** - If you choose a target language the text will be translated into that language in the results box. If the language is supported by Amazon Comprehend, it will move on to interpret the text for:

- ***Sentiment*** - If the text in the box is positive, the icon at the top will become a smiling face, if it's negative it will become a frowning face, and if it's neither it will become a neutral face.

- ***Syntax*** - Hover over a word in the result box to see what part of speech it is in the context of the text as a whole.

<a name="security"></a>

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

<a name="license"></a>

## License

This library is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file.