import { nanoid } from '../util/nanoid.js';

const DB_VERSION = 3;

const defaultData = {
  version: DB_VERSION,
  classes: [
    { id: 'warrior-js', name: 'JavaScript Ninja', language: 'javascript', art: 'samurai', color: '#ffde59' },
    { id: 'ninja-py', name: 'Python Sage', language: 'python', art: 'ninja', color: '#69d2e7' },
    { id: 'monk-java', name: 'Java Knight', language: 'java', art: 'monk', color: '#ff9ff3' },
    { id: 'mage-cpp', name: 'C++ Berserker', language: 'cpp', art: 'mage', color: '#7bd88f' },
  ],
  lessons: {
    javascript: [
      { id: 'js-1', title: 'Basics: Variables', url: 'https://www.w3schools.com/js/js_variables.asp', xp: 20 },
      { id: 'js-2', title: 'Functions', url: 'https://www.w3schools.com/js/js_functions.asp', xp: 30 },
      { id: 'js-3', title: 'Arrays', url: 'https://www.w3schools.com/js/js_arrays.asp', xp: 30 },
    ],
    python: [
      { id: 'py-1', title: 'Basics: Variables', url: 'https://www.w3schools.com/python/python_variables.asp', xp: 20 },
      { id: 'py-2', title: 'Functions', url: 'https://www.w3schools.com/python/python_functions.asp', xp: 30 },
      { id: 'py-3', title: 'Lists', url: 'https://www.w3schools.com/python/python_lists.asp', xp: 30 },
    ],
    java: [],
    cpp: [
      { id: 'cpp-1', title: 'Variables', url: 'https://www.w3schools.com/cpp/cpp_variables.asp', xp: 20 },
      { id: 'cpp-2', title: 'Functions', url: 'https://www.w3schools.com/cpp/cpp_functions.asp', xp: 30 },
      { id: 'cpp-3', title: 'Vectors', url: 'https://www.w3schools.com/cpp/cpp_vectors.asp', xp: 30 },
    ],
  },
  // New progressive curriculum grouped by topics per language
  curriculum: {
    javascript: [
      {
        topic: 'Basics',
        lessons: [
          { id: 'js-b-variables', title: 'Variables and Types', xp: 20, content: `Variables store values. Use const for values that don’t change, let for reassignable values. JS has primitive types: number, string, boolean, null, undefined, symbol, bigint. Objects and arrays are reference types. Examples:\n\nconst pi = 3.14 // constant\nlet score = 0 // can change\nconst name = 'Rin'\nconst isMage = true\nconst bag = ['potion', 'scroll']\nconst hero = { name: 'Rin', level: 1 }\n\nTip: Prefer const by default; switch to let only when you need to reassign.`, tasks: [
            { id: 't1', prompt: 'Create a const named pi set to 3.14', answer: 'const pi = 3.14', xp: 10 },
            { id: 't2', prompt: 'Create a let named score set to 0', answer: 'let score = 0', xp: 10 }
          ], resources: [
            { title: 'MDN – Data types', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures' },
            { title: 'MDN – let / const', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let' }
          ]},
          { id: 'js-b-operators', title: 'Operators and Expressions', xp: 20, content: `Operators combine values. Arithmetic + - * / %; comparison === !== < > <= >=; logical && || !. Example:\n\nconst a = 5, b = 2\nconst sum = a + b // 7\nconst isEqual = a === b // false\nconst ok = (a > 3 && b < 3) // true\n\nUse === and !== (strict) to avoid type coercion surprises.`, tasks: [
            { id: 't1', prompt: 'Using a=5 and b=2, write an expression that is strictly equal to 7', answer: 'a + b', xp: 10 },
            { id: 't2', prompt: 'Write a strict comparison that checks a equals b', answer: 'a === b', xp: 10 }
          ], resources: [
            { title: 'MDN – Operators', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators' }
          ]},
          { id: 'js-b-strings', title: 'Strings & Templates', xp: 20, content: `Strings hold text. Use template literals for interpolation.\n\nconst name = 'Rin'\nconst msg = ` + "`Hello, ${name}!`" + `\n\nLength: name.length. Slice: name.slice(0,2).`, tasks: [
            { id: 't1', prompt: 'Make greeting using template literal with name', answer: 'Hello, ${name}!', xp: 10 }
          ]}
        ]
      },
      {
        topic: 'Control Flow',
        lessons: [
          { id: 'js-cf-if', title: 'if / else', xp: 20, content: `Use if/else to branch. Example:\n\nconst hp = 18\nif (hp <= 0) {\n  console.log('KO')\n} else if (hp < 20) {\n  console.log('Low HP')\n} else {\n  console.log('Healthy')\n}\n\nTernary for simple choices: const status = hp > 0 ? 'Alive' : 'KO'`, tasks: [
            { id: 't1', prompt: 'Write a ternary that sets status to "Alive" if hp>0 else "KO"', answer: 'hp > 0 ? \'Alive\' : \'KO\'', xp: 10 }
          ], resources: [
            { title: 'MDN – if...else', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else' }
          ]},
          { id: 'js-cf-loops', title: 'Loops', xp: 20, content: `Repeat work with loops.\n\nfor (let i = 0; i < 3; i++) { console.log(i) }\n\nconst items = ['potion','sword']\nfor (const it of items) { console.log(it) }\n\nPrefer array methods (map, filter, forEach) for data transforms.`, tasks: [
            { id: 't1', prompt: 'Write a for loop that logs 0,1,2', answer: 'for (let i = 0; i < 3; i++) { console.log(i) }', xp: 10 }
          ], resources: [
            { title: 'MDN – Loops and iteration', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration' }
          ]}
        ]
      },
      {
        topic: 'Collections',
        lessons: [
          { id: 'js-arrays', title: 'Arrays and Methods', xp: 30, content: `Arrays hold ordered lists. Common ops:\n\nconst arr = [1,2,3]\narr.push(4) // add\nconst last = arr.pop() // remove\nconst firstTwo = arr.slice(0,2)\nconst doubled = arr.map(x => x*2)\nconst evens = arr.filter(x => x%2===0)\nconst sum = arr.reduce((a,b)=>a+b,0)`, tasks: [
            { id: 't1', prompt: 'Use map to double [1,2,3] to [2,4,6]', answer: '[1,2,3].map(x => x*2)', xp: 10 }
          ], resources: [
            { title: 'MDN – Arrays', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' }
          ]},
          { id: 'js-objects', title: 'Objects and JSON', xp: 30, content: `Objects store key-value pairs.\n\nconst hero = { name: 'Rin', level: 1 }\nhero.level = 2\nconst { name } = hero // destructuring\nconst hero2 = { ...hero, pet: 'kitsune' } // copy + add\n// JSON: text form of objects\nconst text = JSON.stringify(hero)\nconst obj = JSON.parse(text)`, tasks: [
            { id: 't1', prompt: 'Destructure name from hero', answer: 'const { name } = hero', xp: 10 }
          ], resources: [
            { title: 'MDN – Objects', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics' }
          ]}
        ]
      },
      {
        topic: 'Functions & Modules',
        lessons: [
          { id: 'js-fn', title: 'Functions & Arrow functions', xp: 30, content: `Functions group re-usable steps.\n\nfunction add(a,b){ return a+b }\nconst sub = (a,b) => a-b\n\nDefault params: function greet(name='Traveler'){ ... }\n\nPure functions (no side effects) are easier to test.`, tasks: [
            { id: 't1', prompt: 'Write an arrow function inc that adds 1 to x', answer: 'const inc = x => x + 1', xp: 10 }
          ], resources: [
            { title: 'MDN – Functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions' }
          ]},
          { id: 'js-mod', title: 'Modules (import/export)', xp: 30, content: `Split code into files.\n\n// math.js\nexport function add(a,b){ return a+b }\n// main.js\nimport { add } from './math.js'\n\nUse default export for a main thing, named exports for many utilities.`, tasks: [
            { id: 't1', prompt: 'Write a named export add in math.js', answer: 'export function add(a,b){ return a+b }', xp: 10 }
          ], resources: [
            { title: 'MDN – Modules', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' }
          ]}
        ]
      },
      {
        topic: 'Async',
        lessons: [
          { id: 'js-promise', title: 'Promises', xp: 30, content: `A Promise is a value that arrives later (pending → fulfilled/rejected).\n\nfetch('/data.json')\n  .then(r => r.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err))`, tasks: [
            { id: 't1', prompt: 'Write a promise chain that logs "done" after resolve()', answer: 'resolve().then(() => console.log(\'done\'))', xp: 10 }
          ], resources: [
            { title: 'MDN – Using Promises', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises' }
          ]},
          { id: 'js-async', title: 'async / await', xp: 30, content: `async/await makes async code look synchronous.\n\nasync function load(){\n  try {\n    const r = await fetch('/data.json')\n    const data = await r.json()\n    console.log(data)\n  } catch (e) {\n    console.error(e)\n  }\n}`, tasks: [
            { id: 't1', prompt: 'Write an async function main that awaits fetch("/x")', answer: 'async function main(){ await fetch(\'/x\') }', xp: 10 }
          ], resources: [
            { title: 'MDN – async function', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function' }
          ]}
        ]
      }
    ],
    python: [
      { topic: 'Basics', lessons: [
        { id: 'py-b-variables', title: 'Variables and Types', xp: 20, content: `Variables bind names to values. Types: int, float, bool, str, list, dict, None. No declarations; Python infers type. Examples:\n\npi = 3.14\nname = 'Rin'\nlevel = 1\nis_mage = True\nbag = ['potion', 'scroll']\nhero = { 'name': 'Rin', 'level': 1 }\n\nUse snake_case for names. Reassignment is allowed.`, resources: [
          { title: 'Python Docs – Built-in Types', url: 'https://docs.python.org/3/library/stdtypes.html' }
        ]},
        { id: 'py-b-operators', title: 'Operators', xp: 20, content: `Arithmetic: + - * / // % **. Comparison: == != < <= > >=. Logical: and or not. Example:\n\na, b = 5, 2\nsum_ = a + b  # 7\nis_equal = (a == b)  # False\nok = (a > 3 and b < 3)  # True`, resources: [
          { title: 'Real Python – Operators', url: 'https://realpython.com/python-operators-expressions/' }
        ]}
      ]},
      { topic: 'Control Flow', lessons: [
        { id: 'py-cf-if', title: 'if / elif / else', xp: 20, content: `Branch with if/elif/else. Example:\n\nhp = 18\nif hp <= 0:\n    print('KO')\nelif hp < 20:\n    print('Low HP')\nelse:\n    print('Healthy')`, resources: [
          { title: 'Python Tutorial – If', url: 'https://docs.python.org/3/tutorial/controlflow.html#if-statements' }
        ]},
        { id: 'py-cf-loops', title: 'for / while', xp: 20, content: `Loop over sequences (for) or while a condition holds.\n\nitems = ['potion','sword']\nfor it in items:\n    print(it)\n\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1`, resources: [
          { title: 'Python Tutorial – for', url: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements' }
        ]}
      ]},
      { topic: 'Collections', lessons: [
        { id: 'py-lists', title: 'Lists & Slicing', xp: 30, content: `Lists are ordered, mutable.\n\nnums = [1,2,3]\nnums.append(4)\nlast = nums.pop()\nfirst_two = nums[:2]\ndoubled = [x*2 for x in nums]  # list comprehension`, resources: [
          { title: 'Python Tutorial – Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html' }
        ]},
        { id: 'py-dicts', title: 'Dictionaries', xp: 30, content: `Dictionaries map keys to values.\n\nhero = {'name':'Rin','level':1}\nhero['level'] = 2\nname = hero.get('name')\nfor k, v in hero.items():\n    print(k, v)`, resources: [
          { title: 'Python Docs – dict', url: 'https://docs.python.org/3/library/stdtypes.html#dict' }
        ]}
      ]},
      { topic: 'Functions & Modules', lessons: [
        { id: 'py-fn', title: 'Functions', xp: 30, content: `Define functions with def.\n\ndef add(a, b=0):\n    return a + b\n\nprint(add(2,3))\n\nFunctions are first-class: pass as values, nest them, return them.`, resources: [
          { title: 'Python Tutorial – Defining Functions', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' }
        ]},
        { id: 'py-mod', title: 'Modules & Packages', xp: 30, content: `Split code into files.\n\n# math_utils.py\ndef add(a,b): return a+b\n\n# main.py\nfrom math_utils import add\nprint(add(2,3))\n\nUse packages (folders with __init__.py) to group modules.`, resources: [
          { title: 'Python Tutorial – Modules', url: 'https://docs.python.org/3/tutorial/modules.html' }
        ]}
      ]}
    ],
    java: [
      { topic: 'Java Data Types', lessons: [
        { id: 'java-dt-overview', title: 'Java Data Types Overview', xp: 20, content: `Java Data Types
As explained in the previous chapter, a variable in Java must be a specified data type:

int myNum = 5;               // Integer (whole number)
float myFloatNum = 5.99f;    // Floating point number
char myLetter = 'D';         // Character
boolean myBool = true;       // Boolean
String myText = "Hello";     // String


Data types are divided into two groups:
Primitive data types - includes byte, short, int, long, float, double, boolean and char
Non-primitive data types - such as String, Arrays and Classes (you will learn more about these in a later chapter)

Primitive Data Types
A primitive data type specifies the type of a variable and the kind of values it can hold.
There are eight primitive data types in Java:

byte
Stores whole numbers from -128 to 127

short
Stores whole numbers from -32,768 to 32,767

int
Stores whole numbers from -2,147,483,648 to 2,147,483,647

long
Stores whole numbers from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807

float
Stores fractional numbers. Sufficient for storing 6 to 7 decimal digits

double
Stores fractional numbers. Sufficient for storing 15 to 16 decimal digits

boolean
Stores true or false values

char
Stores a single character/letter or ASCII values

You Cannot Change the Type
Once a variable is declared with a type, it cannot change to another type later in the program:

int myNum = 5;       // myNum is an int
// myNum = "Hello";  // Error: cannot assign a String to an int

String myText = "Hi"; // myText is a String
// myText = 123;      // Error: cannot assign a number to a String


Note: This rule makes Java safer, because the compiler will stop you if you try to mix up types by mistake.
If you really need to change between types, you must use type casting or conversion methods (for example, turning an int into a double).` },
      { id: 'java-dt-numbers', title: 'Numbers', xp: 20, content: `Numbers
Primitive number types are divided into two groups:

Integer types stores whole numbers, positive or negative (such as 123 or -456), without decimals. Valid types are byte, short, int and long. Which type you should use, depends on the numeric value.

Floating point types represents numbers with a fractional part, containing one or more decimals. There are two types: float and double.

Even though there are many numeric types in Java, the most used for numbers are int (for whole numbers) and double (for floating point numbers). However, we will describe them all as you continue to read.

Integer Types

Byte
The byte data type can store whole numbers from -128 to 127. This can be used instead of int or other integer types to save memory when you are certain that the value will be within -128 and 127:

byte myNum = 100;
System.out.println(myNum);


Short
The short data type can store whole numbers from -32768 to 32767:

short myNum = 5000;
System.out.println(myNum);


Int
The int data type can store whole numbers from -2147483648 to 2147483647. In general, and in our tutorial, the int data type is the preferred data type when we create variables with a numeric value.

int myNum = 100000;
System.out.println(myNum);


Long
The long data type can store whole numbers from -9223372036854775808 to 9223372036854775807. This is used when int is not large enough to store the value. Note that you should end the value with an "L":

long myNum = 15000000000L;
System.out.println(myNum);


Floating Point Types
You should use a floating point type whenever you need a number with a decimal, such as 9.99 or 3.14515.

The float and double data types can store fractional numbers. Note that you should end the value with an "f" for floats and "d" for doubles:

Float Example
float myNum = 5.75f;
System.out.println(myNum);


Double Example
double myNum = 19.99d;
System.out.println(myNum);


Use float or double?
The precision of a floating point value indicates how many digits the value can have after the decimal point. The precision of float is only 6-7 decimal digits, while double variables have a precision of about 16 digits.

Therefore it is safer to use double for most calculations.` },
      { id: 'java-dt-booleans', title: 'Boolean Types', xp: 20, content: `Boolean Types
Very often in programming, you will need a data type that can only have one of two values, like:

YES / NO
ON / OFF
TRUE / FALSE

For this, Java has a boolean data type, which can only take the values true or false:

boolean isJavaFun = true;
boolean isFishTasty = false;
System.out.println(isJavaFun);     // Outputs true
System.out.println(isFishTasty);   // Outputs false


Boolean values are mostly used for conditional testing.
You will learn much more about booleans and conditions later in this tutorial.` },
      { id: 'java-dt-characters', title: 'Characters', xp: 20, content: `Characters
The char data type is used to store a single character. The character must be surrounded by single quotes, like 'A' or 'c':

char myGrade = 'B';
System.out.println(myGrade);


Alternatively, if you are familiar with ASCII values, you can use those to display certain characters:

char myVar1 = 65, myVar2 = 66, myVar3 = 67;
System.out.println(myVar1);
System.out.println(myVar2);
System.out.println(myVar3);


Tip: A list of all ASCII values can be found in our ASCII Table Reference.

Strings
The String data type is used to store a sequence of characters (text). String values must be surrounded by double quotes:

String greeting = "Hello World";
System.out.println(greeting);


The String type is so much used and integrated in Java, that some call it "the special ninth type".
A String in Java is actually a non-primitive data type, because it refers to an object. The String object has methods that are used to perform certain operations on strings. Don't worry if you don't understand the term "object" just yet. We will learn more about strings and objects in a later chapter.` },
      { id: 'java-dt-real-life', title: 'Real-Life Example', xp: 20, content: `Real-Life Example
Here's a real-life example of using different data types, to calculate and output the total cost of a number of items:

// Create variables of different data types
int items = 50;
float costPerItem = 9.99f;
float totalCost = items * costPerItem;
char currency = '$';

// Print variables
System.out.println("Number of items: " + items);
System.out.println("Cost per item: " + costPerItem + currency);
System.out.println("Total cost = " + totalCost + currency);` }
      ]},
      { topic: 'Getting started with Java', lessons: [
        { id: 'java-start-what-is-java', title: 'What is Java?', xp: 20, videoUrl: '/assets/videos/intro-to-java.mp4', content: `Java is a popular and powerful programming language, created in 1995. It is owned by Oracle, and more than 3 billion devices run Java.

It is used for:
- Mobile applications (specially Android apps)
- Desktop applications
- Web applications
- Web servers and application servers
- Games
- Database connection
- And much, much more!

Why Use Java?
- Java works on different platforms (Windows, Mac, Linux, Raspberry Pi, etc.)
- It is one of the most popular programming languages in the world
- It has a large demand in the current job market
- It is easy to learn and simple to use
- It is open-source and free
- It is secure, fast and powerful
- It has huge community support (tens of millions of developers)
- Java is an object oriented language which gives a clear structure to programs and allows code to be reused, lowering development costs
- As Java is close to C++ and C#, it makes it easy for programmers to switch to Java or vice versa

Java Example
Java is often used in everyday programming tasks, like saying hello to a user:

public class Main {
  public static void main(String[] args) {
    String name = "John";
    System.out.println("Hello " + name);
  }
}

Result:
Hello John` },
        { id: 'java-start-getting-started', title: 'Getting started with Java', xp: 20, videoUrl: '/assets/videos/java-lesson-2.mp4', content: `In Java, every application begins with a class name, and that class must match the filename.

Let's create our first Java file, called Main.java, which can be done in any text editor (like Notepad).

The file should contain a "Hello World" message, which is written with the following code:

Main.java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}

Don't worry if you don't understand the code above - we will discuss it in detail in later chapters. For now, focus on how to run the code above.

Save the code in Notepad as "Main.java". Open Command Prompt (cmd.exe), navigate to the directory where you saved your file, and type "javac Main.java":
C:\\Users\\Your Name>javac Main.java

This will compile your code. If there are no errors in the code, the command prompt will take you to the next line. Now, type "java Main" to run the file:
C:\\Users\\Your Name>java Main

The output should read:
Hello World

Congratulations! You have written and executed your first Java program.` },
        { id: 'java-start-syntax', title: 'Java Syntax', xp: 20, videoUrl: '/assets/videos/java-lesson-3.mp4', content: `In the previous chapter, we created a Java file called Main.java, and we used the following code to print "Hello World" to the screen:

Main.java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}

Example explained
Every line of code that runs in Java must be inside a class. The class name should always start with an uppercase first letter. In our example, we named the class Main.

Note: Java is case-sensitive. MyClass and myclass would be treated as two completely different names.

The name of the Java file must match the class name. So if your class is called Main, the file must be saved as Main.java. This is because Java uses the class name to find and run your code. If the names don't match, Java will give an error and the program will not run.

When saving the file, save it using the class name and add .java to the end of the filename. To run the example above on your computer, make sure that Java is properly installed: Go to the Get Started Chapter for how to install Java. The output should be:
Hello World

The main Method
The main() method is required in every Java program. It is where the program starts running:
public static void main(String[] args)

Any code placed inside the main() method will be executed.

For now, you don't need to understand the keywords public, static, and void. You will learn about them later in this tutorial. Just remember: main() is the starting point of every Java program.

System.out.println()
Inside the main() method, we can use the println() method to print a line of text to the screen:

public static void main(String[] args) {
  System.out.println("Hello World");
}` },
        { id: 'java-start-statements', title: 'Statements', xp: 20, videoUrl: '/assets/videos/java-lesson-4.mp4', content: `Statements
A computer program is a list of "instructions" to be "executed" by a computer.
In a programming language, these programming instructions are called statements.
The following statement "instructs" the compiler to print the text "Java is fun!" to the screen:

System.out.println("Java is fun!");

It is important that you end the statement with a semicolon ;.
If you forget the semicolon (;), an error will occur and the program will not run:

System.out.println("Java is fun!")

Result:
error: ';' expected

Tip: You can think of a statement like a sentence in English. Just as sentences end with a period ., Java statements end with a semicolon ;.

Many Statements
Most Java programs contain many statements.
The statements are executed, one by one, in the same order as they are written:

System.out.println("Hello World!");
System.out.println("Have a good day!");
System.out.println("Learning Java is fun!");

Example explained
From the example above, we have three statements:
System.out.println("Hello World!");
System.out.println("Have a good day!");
System.out.println("Learning Java is fun!");

The first statement is executed first (print "Hello World!" to the screen).
Then the second statement is executed (print "Have a good day!" to the screen).
And at last, the third statement is executed (print "Learning Java is fun!" to the screen).

You will learn more about statements while reading this tutorial. For now, just remember to always end them with a semicolon to avoid any errors.` },
        { id: 'java-start-printing', title: 'Printing Text in Java', xp: 20, videoUrl: '/assets/videos/java-lesson-5.mp4', content: `Print Text
You learned from the previous chapter that you can use the println() method to output values or print text in Java:

System.out.println("Hello World!");


You can add as many println() methods as you want. Note that it will add a new line for each method:

System.out.println("Hello World!");
System.out.println("I am learning Java.");
System.out.println("It is awesome!");


Double Quotes
Text must be wrapped inside double quotations marks "".
If you forget the double quotes, an error occurs:

System.out.println("This sentence will work!");
System.out.println(This sentence will produce an error);

The Print() Method
There is also a print() method, which is similar to println().
The only difference is that it does not insert a new line at the end of the output:

System.out.print("Hello World! ");
System.out.print("I will print on the same line.");

Note that we add an extra space (after "Hello World!" in the example above) for better readability.
In this tutorial, we will only use println() as it makes the code output easier to read.` },
        { id: 'java-start-print-numbers', title: 'Print Numbers', xp: 20, videoUrl: '/assets/videos/java-lesson-6.mp4', content: `Print Numbers
You can also use the println() method to print numbers.
However, unlike text, we don't put numbers inside double quotes:

System.out.println(3);
System.out.println(358);
System.out.println(50000);

You can also perform mathematical calculations inside the println() method:

System.out.println(3 + 3);

System.out.println(2 * 5);` },
        { id: 'java-start-comments', title: 'Java Comments', xp: 20, videoUrl: '/assets/videos/java-lesson-7.mp4', content: `Java Comments
Comments can be used to explain Java code, and to make it more readable. It can also be used to prevent execution when testing alternative code.

Single-line Comments
Single-line comments start with two forward slashes (//).
Any text between // and the end of the line is ignored by Java (will not be executed).
This example uses a single-line comment before a line of code:

// This is a comment
System.out.println("Hello World");


This example uses a single-line comment at the end of a line of code:

System.out.println("Hello World"); // This is a comment


Java Multi-line Comments
Multi-line comments start with /* and ends with */.
Any text between /* and */ will be ignored by Java.
This example uses a multi-line comment (a comment block) to explain the code:

/* The code below will print the words Hello World
to the screen, and it is amazing */
System.out.println("Hello World");


Single or multi-line comments?
It's up to you which one you use. Normally, we use // for short comments, and /* */ for longer.` },
        { id: 'java-start-variables', title: 'Variables in Java', xp: 20, videoUrl: '/assets/videos/java-lesson-8.mp4', content: `Java Variables
Variables are containers for storing data values.
In Java, there are different types of variables, for example:
String - stores text, such as "Hello". String values are surrounded by double quotes
int - stores integers (whole numbers), without decimals, such as 123 or -123
float - stores floating point numbers, with decimals, such as 19.99 or -19.99
char - stores single characters, such as 'a' or 'B'. Char values are surrounded by single quotes
boolean - stores values with two states: true or false

Declaring (Creating) Variables
To create a variable in Java, you need to:
Choose a type (like int or String)
Give the variable a name (like x, age, or name)
Optionally assign it a value using =

Here's the basic syntax:
type variableName = value;

For example, if you want to store some text, you can use a String:
Create a variable called name of type String and assign it the value "John".
Then we use println() to print the name variable:
String name = "John";
System.out.println(name);


To create a variable that should store a number, you can use int:
Create a variable called myNum of type int and assign it the value 15:
int myNum = 15;
System.out.println(myNum);


You can also declare a variable without assigning the value, and assign the value later:
int myNum;
myNum = 15;
System.out.println(myNum);


Note that if you assign a new value to an existing variable, it will overwrite the previous value:
Change the value of myNum from 15 to 20:
int myNum = 15;
myNum = 20;  // myNum is now 20
System.out.println(myNum);


Final Variables
If you don't want others (or yourself) to overwrite existing values, use the final keyword (this will declare the variable as "final" or "constant", which means unchangeable and read-only):
final int myNum = 15;
myNum = 20;  // will generate an error: cannot assign a value to a final variable


Other Types
A demonstration of how to declare variables of other types:
int myNum = 5;
float myFloatNum = 5.99f;
char myLetter = 'D';
boolean myBool = true;
String myText = "Hello";` },
        { id: 'java-start-display-variables', title: 'Display Variables', xp: 20, videoUrl: '/assets/videos/java-lesson-9.mp4', content: `Display Variables
The println() method is often used to display variables.
To combine both text and a variable, use the + character:

String name = "John";
System.out.println("Hello " + name);


You can also use the + character to add a variable to another variable:

String firstName = "John ";
String lastName = "Doe";
String fullName = firstName + lastName;
System.out.println(fullName);


In Java, the + symbol has two meanings:
For text (strings), it joins them together (called concatenation).
For numbers, it adds values together.
For numeric values, the + character works as a mathematical operator (notice that we use int (integer) variables here):

int x = 5;
int y = 6;
System.out.println(x + y); // Print the value of x + y


From the example above, here's what happens step by step:
x stores the value 5
y stores the value 6
println() displays the result of x + y, which is 11


Mixing Text and Numbers
Be careful when combining text and numbers in the same line of code. Without parentheses, Java will treat the numbers as text after the first string:

int x = 5;
int y = 6;

System.out.println("The sum is " + x + y);   // Prints: The sum is 56
System.out.println("The sum is " + (x + y)); // Prints: The sum is 11


Explanation:
In the first line, Java combines "The sum is " with x, creating the string "The sum is 5". Then y is added to that string, so it becomes "The sum is 56".
In the second line, the parentheses make sure x + y is calculated first (resulting in 11), so the output is "The sum is 11".` },
        { id: 'java-start-multi-vars', title: 'Declare Many Variables', xp: 20, videoUrl: '/assets/videos/java-lesson-10.mp4', content: `Declare Many Variables
To declare more than one variable of the same type, you can use a comma-separated list:

Instead of writing:
int x = 5;
int y = 6;
int z = 50;
System.out.println(x + y + z); // 61

You can write:
int x = 5, y = 6, z = 50;
System.out.println(x + y + z); // 61


Note: Declaring many variables in one line is shorter, but writing one variable per line can sometimes make the code easier to read.

One Value to Multiple Variables
You can also assign the same value to multiple variables in one line:

int x, y, z;
x = y = z = 50;
System.out.println(x + y + z); // 150` },
        
      ]
    }
    ]
  },
  dungeons: [
    { id: 'slime-cave', title: 'Slime Cave', difficulty: 'Easy', engine: 'quiz', xp: 50, coins: 30 },
    { id: 'fox-forest', title: 'Fox Forest', difficulty: 'Normal', engine: 'js-runner', xp: 100, coins: 80 },
    { id: 'oni-keep', title: 'Oni Keep', difficulty: 'Hard', engine: 'leetcode-medium', xp: 200, coins: 150 },
  ],
  puzzles: {
    'js-runner': [
      { id: 'sum-two', language: 'javascript', title: 'Two Sum', starter: 'function twoSum(nums, target) {\n  // return indices\n}\n\nmodule.exports = twoSum;', tests: [
        { input: 'twoSum([2,7,11,15], 9)', expect: '[0,1]' },
      ], xp: 120, coins: 80 },
    ],
    quiz: [
      // JavaScript
      { id: 'js-const', language: 'javascript', title: 'JS Basics: const', questions: [
        { q: 'Which keyword declares a constant in JavaScript?', choices: ['var','let','const'], a: 2 },
      ], xp: 40, coins: 20 },
      { id: 'js-array-map', language: 'javascript', title: 'JS Arrays: map()', questions: [
        { q: 'Which method creates a new array by transforming each element?', choices: ['filter','map','reduce'], a: 1 },
      ], xp: 50, coins: 30 },
      { id: 'js-str-len', language: 'javascript', title: 'JS String length', questions: [
        { q: 'How do you get the length of a string s?', choices: ['len(s)','s.size','s.length'], a: 2 },
      ], xp: 40, coins: 20 },
      { id: 'js-compare', language: 'javascript', title: 'JS Strict Equality', questions: [
        { q: 'Which operator compares value and type?', choices: ['==','===','='], a: 1 },
      ], xp: 40, coins: 20 },
      { id: 'js-loop-forof', language: 'javascript', title: 'JS for...of', questions: [
        { q: 'Which loop iterates values of an array?', choices: ['for...in','for...of','while'], a: 1 },
      ], xp: 40, coins: 20 },
      { id: 'js-fn-arrow', language: 'javascript', title: 'JS Arrow Functions', questions: [
        { q: 'Which defines an arrow function that returns x+1?', choices: ['x => x + 1','(x) -> x + 1','function => x + 1'], a: 0 },
      ], xp: 50, coins: 30 },
      { id: 'js-array-filter', language: 'javascript', title: 'JS Arrays: filter()', questions: [
        { q: 'filter() returns...', choices: ['A single value','A new array','Modifies original array'], a: 1 },
      ], xp: 40, coins: 20 },
      { id: 'js-obj-prop', language: 'javascript', title: 'JS Object property', questions: [
        { q: 'How to read property name on obj?', choices: ['obj[name]','obj->name','obj(name)'], a: 0 },
      ], xp: 40, coins: 20 },

      // Python
      { id: 'py-lists', language: 'python', title: 'Py Lists', questions: [
        { q: 'Which syntax creates a list of 3 items?', choices: ['(1,2,3)','[1,2,3]','{1,2,3}'], a: 1 },
      ], xp: 40, coins: 20 },
      { id: 'py-if', language: 'python', title: 'Py if/elif', questions: [
        { q: 'Which keyword follows if for another condition?', choices: ['elseif','elif','else if'], a: 1 },
      ], xp: 50, coins: 30 },
      { id: 'py-len', language: 'python', title: 'Py len()', questions: [
        { q: 'How to get length of a string s?', choices: ['s.length','len(s)','size(s)'], a: 1 },
      ], xp: 40, coins: 20 },
      { id: 'py-true', language: 'python', title: 'Py Booleans', questions: [
        { q: 'Which is a boolean literal?', choices: ['True','TRUE','true'], a: 0 },
      ], xp: 40, coins: 20 },
      { id: 'py-loop', language: 'python', title: 'Py Loop', questions: [
        { q: 'Loop over items = [1,2,3]', choices: ['for i in range(items)','foreach i in items','for i in items'], a: 2 },
      ], xp: 40, coins: 20 },
      { id: 'py-fn-def', language: 'python', title: 'Py def', questions: [
        { q: 'Define function add that returns a+b', choices: ['def add(a,b): return a+b','function add(a,b): a+b','def add(a,b) -> a+b'], a: 0 },
      ], xp: 50, coins: 30 },
      { id: 'py-dict', language: 'python', title: 'Py dict access', questions: [
        { q: 'Read key name from hero', choices: ['hero.name','hero["name"]','get(hero,"name")'], a: 1 },
      ], xp: 40, coins: 20 },
      { id: 'py-slice', language: 'python', title: 'Py slicing', questions: [
        { q: 'items[:2] returns...', choices: ['Last 2','First 2','All but 2'], a: 1 },
      ], xp: 40, coins: 20 },

      // Java
      { id: 'java-array', language: 'java', title: 'Java Arrays', questions: [
        { q: 'Which declares an int array of size 3?', choices: ['int[3] a;','int a[] = new int[3];','int a = new int[3];'], a: 1 },
      ], xp: 50, coins: 30 },
      { id: 'java-boolean', language: 'java', title: 'Java Booleans', questions: [
        { q: 'Which is a boolean literal?', choices: ['True','TRUE','true'], a: 2 },
      ], xp: 40, coins: 20 },
      { id: 'java-string-length', language: 'java', title: 'Java String length()', questions: [
        { q: 'How to get length of String s?', choices: ['len(s)','s.length','s.length()'], a: 2 },
      ], xp: 40, coins: 20 },
      { id: 'java-for-each', language: 'java', title: 'Java for-each', questions: [
        { q: 'For int[] a, which loops items?', choices: ['for(int i: a){}','foreach (int i in a){}','for i in a {}'], a: 0 },
      ], xp: 40, coins: 20 },
      { id: 'java-equals', language: 'java', title: 'Java String equality', questions: [
        { q: 'Compare Strings a and b by value:', choices: ['a == b','a.equals(b)','equals(a,b)'], a: 1 },
      ], xp: 50, coins: 30 },
      { id: 'java-arraylist-add', language: 'java', title: 'Java ArrayList add', questions: [
        { q: 'How to add 1 to ArrayList<Integer> list?', choices: ['list.add(1);','list.push(1);','add(list,1);'], a: 0 },
      ], xp: 40, coins: 20 },
      { id: 'java-method-decl', language: 'java', title: 'Java method', questions: [
        { q: 'Which declares a method returning int?', choices: ['int add(a,b){}','int add(int a,int b){ return a+b; }','add(int a,int b){ return a+b; }'], a: 1 },
      ], xp: 50, coins: 30 },
      { id: 'java-switch', language: 'java', title: 'Java switch', questions: [
        { q: 'Which is valid switch syntax?', choices: ['switch x {}','switch(x){}','switch(x) -> {}'], a: 1 },
      ], xp: 40, coins: 20 },

      // C++
      { id: 'cpp-vector', language: 'cpp', title: 'C++ vector', questions: [
        { q: 'Which adds an item to std::vector<int> v?', choices: ['v.add(1);','v.push_back(1);','push(v,1);'], a: 1 },
      ], xp: 50, coins: 30 },
      { id: 'cpp-include', language: 'cpp', title: 'C++ Include', questions: [
        { q: 'Which includes vector header?', choices: ['#include <vector>','#include "vector"','#include vector'], a: 0 },
      ], xp: 40, coins: 20 },
      { id: 'cpp-str-length', language: 'cpp', title: 'C++ string length', questions: [
        { q: 'How to get length of std::string s?', choices: ['len(s)','s.length()','s.size[]'], a: 1 },
      ], xp: 40, coins: 20 },
      { id: 'cpp-for-range', language: 'cpp', title: 'C++ range-for', questions: [
        { q: 'Loop over std::vector<int> v', choices: ['for (auto i : v) {}','foreach (i in v) {}','for i in v {}'], a: 0 },
      ], xp: 40, coins: 20 },
      { id: 'cpp-compare', language: 'cpp', title: 'C++ compare strings', questions: [
        { q: 'Compare std::string a and b by value:', choices: ['a == b','equals(a,b)','strcmp(a,b)==0'], a: 0 },
      ], xp: 50, coins: 30 },
      { id: 'cpp-pushback', language: 'cpp', title: 'C++ vector push_back', questions: [
        { q: 'Add 1 to vector v', choices: ['v.push(1);','v.push_back(1);','push(v,1);'], a: 1 },
      ], xp: 40, coins: 20 },
      { id: 'cpp-func-decl', language: 'cpp', title: 'C++ function', questions: [
        { q: 'Declare a function add returning int', choices: ['int add(a,b){}','int add(int a,int b){ return a+b; }','add(int a,int b){ return a+b; }'], a: 1 },
      ], xp: 50, coins: 30 },
      
      // Medium: JavaScript
      { id: 'js-med-reduce-sum', language: 'javascript', title: 'JS reduce: sum', questions: [
        { q: 'Which reduce sums array a = [1,2,3] to 6?', choices: ['a.reduce((a,b)=>a+b)','a.reduce((sum,x)=>sum+x,0)','sum(a)'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'js-med-destruct', language: 'javascript', title: 'JS Object destructuring', questions: [
        { q: 'Extract name from const hero = { name:"Rin", lvl:1 }', choices: ['const name = hero.name','const { name } = hero','let name <- hero'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'js-med-set-size', language: 'javascript', title: 'JS Set size', questions: [
        { q: 'new Set([1,1,2,3]).size === ?', choices: ['3','4','2'], a: 0 },
      ], xp: 60, coins: 35 },

      // Medium: Python
      { id: 'py-med-list-comp', language: 'python', title: 'Py list comprehension', questions: [
        { q: 'Square each x in [1,2,3] to [1,4,9]', choices: ['map(lambda x:x*x,[1,2,3])','[x*x for x in [1,2,3]]','square([1,2,3])'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'py-med-dict-comp', language: 'python', title: 'Py dict keys', questions: [
        { q: 'Safely get key "name" from d', choices: ['d.name','d.get("name")','get(d,"name")'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'py-med-join', language: 'python', title: 'Py str.join', questions: [
        { q: "'-,'.join(['a','b','c']) == ?", choices: ['a-b-c','a,-,b,-,c','a,b,c'], a: 2 },
      ], xp: 60, coins: 35 },

      // Medium: Java
      { id: 'java-med-arraylist-get', language: 'java', title: 'Java ArrayList get()', questions: [
        { q: 'Get first element of ArrayList<Integer> list', choices: ['list[0]','list.get(0)','get(list,0)'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'java-med-hashmap-put', language: 'java', title: 'Java HashMap put()', questions: [
        { q: 'Insert ("k",1) into HashMap<String,Integer> m', choices: ['m.add("k",1);','m.put("k",1);','put(m,"k",1);'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'java-med-string-split', language: 'java', title: 'Java String split', questions: [
        { q: 'Split s by comma', choices: ['s.split(",")','split(s,",")','s.splitBy(",")'], a: 0 },
      ], xp: 60, coins: 35 },

      // Medium: C++
      { id: 'cpp-med-vector-index', language: 'cpp', title: 'C++ vector index', questions: [
        { q: 'Read first element of std::vector<int> v', choices: ['v(0)','v[0]','get(v,0)'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'cpp-med-map-insert', language: 'cpp', title: 'C++ unordered_map insert', questions: [
        { q: 'Insert {"k",1} into std::unordered_map<std::string,int> m', choices: ['m.insert({"k",1});','m.add("k",1);','insert(m,"k",1);'], a: 0 },
      ], xp: 60, coins: 35 },
      { id: 'cpp-med-std-sort', language: 'cpp', title: 'C++ std::sort', questions: [
        { q: 'Sort vector<int> v ascending', choices: ['sort(v)','std::sort(v.begin(), v.end())','v.sort()'], a: 1 },
      ], xp: 60, coins: 35 },

      // More: JavaScript
      { id: 'js-med-truthy', language: 'javascript', title: 'JS Truthy/Falsy', questions: [
        { q: 'Which is falsy?', choices: ['"0"', '[]', '0'], a: 2 },
      ], xp: 60, coins: 35 },
      { id: 'js-med-obj-keys', language: 'javascript', title: 'JS Object.keys()', questions: [
        { q: 'Object.keys({a:1,b:2}).length == ?', choices: ['1','2','undefined'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'js-med-map-size', language: 'javascript', title: 'JS Map size', questions: [
        { q: 'new Map([["a",1],["b",2],["a",9]]).size == ?', choices: ['2','3','1'], a: 0 },
      ], xp: 60, coins: 35 },
      { id: 'js-med-class', language: 'javascript', title: 'JS Class basics', questions: [
        { q: 'How to define a class Hero with constructor(name)?', choices: ['class Hero { constructor(name){ this.name=name } }','function class Hero(name){}','makeClass Hero(name){}'], a: 0 },
      ], xp: 70, coins: 40 },

      // More: Python
      { id: 'py-med-truthy', language: 'python', title: 'Py Truthy/Falsy', questions: [
        { q: 'Which is falsy?', choices: ['[]','"0"','[0]'], a: 0 },
      ], xp: 60, coins: 35 },
      { id: 'py-med-dict-len', language: 'python', title: 'Py dict length', questions: [
        { q: 'len({"a":1, "b":2, "a":9}) == ?', choices: ['3','2','1'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'py-med-str-split', language: 'python', title: 'Py str.split', questions: [
        { q: '"a,b,c".split(",") == ?', choices: ['["a","b","c"]','("a","b","c")','{"a","b","c"}'], a: 0 },
      ], xp: 60, coins: 35 },
      { id: 'py-med-class', language: 'python', title: 'Py Class basics', questions: [
        { q: 'Define class Hero with __init__(self,name)', choices: ['class Hero: def __init__(name): pass','class Hero: def __init__(self,name): self.name=name','class Hero(name): pass'], a: 1 },
      ], xp: 70, coins: 40 },

      // More: Java
      { id: 'java-med-if-ternary', language: 'java', title: 'Java ternary', questions: [
        { q: 'Select a ternary to set s to "OK" when x>0 else "NO"', choices: ['s = x>0 ? "OK" : "NO";','s = (x>0) then "OK" else "NO";','s = if (x>0) "OK" else "NO";'], a: 0 },
      ], xp: 60, coins: 35 },
      { id: 'java-med-list-size', language: 'java', title: 'Java ArrayList size', questions: [
        { q: 'Get size of ArrayList<String> list', choices: ['list.size()','len(list)','list.length'], a: 0 },
      ], xp: 60, coins: 35 },
      { id: 'java-med-map-get', language: 'java', title: 'Java HashMap get', questions: [
        { q: 'Read value of key "k" from HashMap<String,Integer> m', choices: ['m["k"]','m.get("k")','get(m,"k")'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'java-med-class', language: 'java', title: 'Java Class basics', questions: [
        { q: 'Valid field declaration?', choices: ['int level = 1;','var level = 1;','let level = 1;'], a: 0 },
      ], xp: 70, coins: 40 },

      // More: C++
      { id: 'cpp-med-if-ternary', language: 'cpp', title: 'C++ ternary', questions: [
        { q: 'Set s to "OK" when x>0 else "NO"', choices: ['s = x>0 ? "OK" : "NO";','s = if (x>0) "OK" else "NO";','s = (x>0) then "OK" else "NO";'], a: 0 },
      ], xp: 60, coins: 35 },
      { id: 'cpp-med-vector-size', language: 'cpp', title: 'C++ vector size', questions: [
        { q: 'Get size of std::vector<int> v', choices: ['len(v)','v.length()','v.size()'], a: 2 },
      ], xp: 60, coins: 35 },
      { id: 'cpp-med-map-find', language: 'cpp', title: 'C++ unordered_map find', questions: [
        { q: 'Check if key "k" exists in std::unordered_map<string,int> m', choices: ['m.contains("k")','m.find("k") != m.end()','has(m,"k")'], a: 1 },
      ], xp: 60, coins: 35 },
      { id: 'cpp-med-class', language: 'cpp', title: 'C++ Class basics', questions: [
        { q: 'Valid field declaration in class?', choices: ['var level = 1;','int level = 1;','let level = 1;'], a: 1 },
      ], xp: 70, coins: 40 },
    ],
    'leetcode-medium': [
      { id: 'longest-substring', title: 'Longest Substring Without Repeating Characters', ref: 'LeetCode 3', xp: 200, coins: 150 },
    ],
  },
  shop: {
    cosmetics: [
      { id: 'hat-bamboo', name: 'Bamboo Hat', slot: 'head', price: 120 },
      { id: 'robe-indigo', name: 'Indigo Robe', slot: 'body', price: 220 },
      { id: 'pet-kitsune', name: 'Kitsune Pet', slot: 'pet', price: 500 },
    ],
    sprites: [
      { id: 'sprite-herta', name: 'Herta', file: 'herta.png', path: '/assets/sprites/herta.png', price: 75 },
      { id: 'sprite-clara', name: 'Clara', file: 'clara.png', path: '/assets/sprites/clara.png', price: 75 },
      { id: 'sprite-march', name: 'March', file: 'march.png', path: '/assets/sprites/march.png', price: 75 },
      { id: 'sprite-silver', name: 'Silver', file: 'silver.png', path: '/assets/sprites/silver.png', price: 75 },
      { id: 'sprite-seele', name: 'Seele', file: 'seele.png', path: '/assets/sprites/seele.png', price: 75 },
    ]
  }
};

const KEY = 'codequest_db_v1';

export async function initDB() {
  const existing = localStorage.getItem(KEY);
  if (!existing) {
    localStorage.setItem(KEY, JSON.stringify(defaultData));
    // After seeding, run one-time user progress reset
    try {
      const FLAG = 'progress_reset_auto_2025_11_12_v4';
      if (!localStorage.getItem(FLAG)) {
        resetAllUserProgress();
        localStorage.setItem(FLAG, '1');
      }
    } catch {}
    return;
  }
  // Migrate: ensure curriculum exists in older installs
  try {
    const obj = JSON.parse(existing);
    let migrated = false;
    if (!obj.curriculum) { obj.curriculum = defaultData.curriculum; migrated = true; }
    // Merge in any new quizzes by id
    try {
      if (!obj.puzzles) obj.puzzles = defaultData.puzzles, migrated = true;
      if (!Array.isArray(obj.puzzles.quiz)) obj.puzzles.quiz = [], migrated = true;
      const byId = new Set(obj.puzzles.quiz.map(q => q.id));
      defaultData.puzzles.quiz.forEach(q => { if (!byId.has(q.id)) { obj.puzzles.quiz.push(q); migrated = true; } });
      // Ensure js-runner items carry language tag
      if (Array.isArray(obj.puzzles['js-runner'])) {
        obj.puzzles['js-runner'].forEach(p => { if (!p.language) p.language = 'javascript'; });
      }
      // Ensure shop and sprites exist; merge sprites by id
      if (!obj.shop) { obj.shop = JSON.parse(JSON.stringify(defaultData.shop)); migrated = true; }
      if (!Array.isArray(obj.shop.sprites)) { obj.shop.sprites = []; migrated = true; }
      const spriteIds = new Set(obj.shop.sprites.map(s => s.id));
      (defaultData.shop.sprites||[]).forEach(s => { if (!spriteIds.has(s.id)) { obj.shop.sprites.push(s); migrated = true; } });
    } catch {}
    // Clear Java curriculum/lessons that were previously seeded
    try {
      // Always normalize Java: wipe any existing and seed our new single-topic track
      if (!obj.curriculum) obj.curriculum = {};
      obj.curriculum.java = defaultData.curriculum.java;
      if (obj.lessons && Array.isArray(obj.lessons.java) && obj.lessons.java.length) {
        obj.lessons.java = [];
      }
      migrated = true;
    } catch {}
    if (!obj.version || obj.version < DB_VERSION) { obj.version = DB_VERSION; migrated = true; }
    // Ensure class display names are updated
    try {
      if (Array.isArray(obj.classes)) {
        const byId = Object.fromEntries(defaultData.classes.map(c => [c.id, c]));
        obj.classes = obj.classes.map(c => {
          const ref = byId[c.id];
          return ref ? { ...c, name: ref.name } : c;
        });
        migrated = true;
      }
    } catch {}
    if (migrated) localStorage.setItem(KEY, JSON.stringify(obj));
    // Ensure one-time user progress reset runs even on existing DBs
    try {
      const FLAG = 'progress_reset_auto_2025_11_12_v4';
      if (!localStorage.getItem(FLAG)) {
        resetAllUserProgress();
        localStorage.setItem(FLAG, '1');
      }
    } catch {}
  } catch {}
}

export function db() {
  return JSON.parse(localStorage.getItem(KEY));
}

export function saveDb(newDb) {
  localStorage.setItem(KEY, JSON.stringify(newDb));
}

function applyOneTimeProgressReset(user) {
  if (user && !user.__progress_reset_2025_11_12_v2) {
    user.completedLessons = [];
    user.completedTasks = [];
    user.completedPuzzles = [];
    user.points = 0;
    user.__progress_reset_2025_11_12_v2 = true;
  }
  return user;
}

export function ensureUser(uid, profile) {
  const USER_KEY = 'codequest_user_' + uid;
  const existing = localStorage.getItem(USER_KEY);
  if (existing) {
    const u = applyOneTimeProgressReset(JSON.parse(existing));
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return u;
  }
  const user = {
    id: uid,
    name: profile.name,
    email: profile.email,
    avatar: profile.picture || '',
    level: 1,
    xp: 0,
    coins: 0,
    points: 0,
    awardedLessons: [],
    awardedPuzzles: [],
    unmarkedLessons: [],
    spentPointsSprites: [],
    activeSprite: null,
    primaryClass: null,
    party: [],
    inventory: [],
    completedLessons: [],
    completedTasks: [],
    completedPuzzles: [],
    retired: false,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function loadUser(uid) {
  const USER_KEY = 'codequest_user_' + uid;
  const existing = localStorage.getItem(USER_KEY);
  if (!existing) return null;
  const u = applyOneTimeProgressReset(JSON.parse(existing));
  localStorage.setItem(USER_KEY, JSON.stringify(u));
  return u;
}

export function saveUser(user) {
  const USER_KEY = 'codequest_user_' + user.id;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function award(user, { xp = 0, coins = 0 }) {
  user.xp += xp; user.coins += coins;
  while (user.level < 99 && user.xp >= xpForNext(user.level)) {
    user.level++;
  }
  if (user.level >= 99) user.retired = true;
}

export function xpForNext(level) {
  return 50 + level * 50;
}


// One-time auto reset to clear local DB progress now
(function runOneTimeProgressResetNow(){
  try {
    const FLAG = 'progress_reset_now_2025_11_12_v2';
    if (!localStorage.getItem(FLAG)) {
      resetAllUserProgress();
      localStorage.setItem(FLAG, '1');
    }
  } catch {}
})();
// Optional: expose a manual reset hook for console-based one-time use
try {
  if (typeof window !== 'undefined' && !window.__resetAllUserProgress) {
    window.__resetAllUserProgress = resetAllUserProgress;
  }
} catch {}

// Admin utility: Reset progress for all users stored in localStorage
export function resetAllUserProgress() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith('codequest_user_')) continue;
      try {
        const u = JSON.parse(localStorage.getItem(k));
        if (!u || typeof u !== 'object') continue;
        u.completedLessons = [];
        u.completedTasks = [];
        u.completedPuzzles = [];
        u.points = 0;
        localStorage.setItem(k, JSON.stringify(u));
      } catch {}
    }
    // Also sync the active session auth to reflect cleared user
    try {
      const AUTH_KEY = 'codequest_auth_v1';
      const raw = sessionStorage.getItem(AUTH_KEY);
      if (raw) {
        const auth = JSON.parse(raw);
        const userKey = auth?.user?.id ? ('codequest_user_' + auth.user.id) : null;
        if (userKey) {
          const refreshed = JSON.parse(localStorage.getItem(userKey) || 'null');
          if (refreshed) {
            auth.user = refreshed;
            sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
          }
        }
      }
    } catch {}
  } catch {}
}


