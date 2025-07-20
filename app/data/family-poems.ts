export interface FamilyPoem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  copyright: string;
  category: 'family';
  audioUrl?: string;
}

export const familyPoems: FamilyPoem[] = [
  {
    id: "america-dancing",
    title: "America Dancing",
    content: `Black and white
White and black
Two steps forward
One step back
Circle round and do-si-do
Let's all join hands.

Daily, let the dance begin
Black and white, white and black
We move together, we all win
Two steps forward, one step back

Swing your partner, allemande right
Black and white, white and black
In and out of rainbow light
Two steps forward, one step back

Play, O Fiddler, wild and sweet
Black and white, white and black
And we'll be dancin' in the street
Two steps forward, one step back.

Black and white
White and black
Forward, forward
No more back
Circle round and do-si-do
Let's all join hands.`,
    excerpt: "Black and white\nWhite and black\nTwo steps forward\nOne step back\nCircle round and do-si-do\nLet's all join hands.\n\nDaily, let the dance begin\nBlack",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "autumn-lullabye",
    title: "Autumn Lullabye",
    content: `Geese are flying overhead
Flying off to winter bed
Flying off to downy nest.
Summer's yawning, time to rest.

Squirrels are bouncing here and there
Finding acorns everywhere
Finding velvet moss for bed.
Autumn's humming, rest your head.

Whales are diving through the seas
Swimming south before they freeze
Swimming, sleeping, spouting sighs.
Winter's calling, close you eyes.

I will hold you. No more crying
No more bouncing, no more flying
No more shouting, little one.
Snow is near and day is done.

Bunnies cuddle. Grizzlies snore.
Nothing moving anymore
Nothing talking, not a peep.
Autumn loves you, go to sleep.`,
    excerpt: "Geese are flying overhead\nFlying off to winter bed\nFlying off to downy nest.\nSummer's yawning, time to rest.\n\nSquirrels are bouncing here and there",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "building-blocks",
    title: "Building Blocks",
    content: `I sure miss my sister
She's moving away.
Pretty soon, all her things will be gone.
Her room next to mine
Will be empty and echo.
Today, she was married to John.

She says she and John
Have been building a house.
All the walls are these bricks made of prayer
So no earthquake or flood
Can tear down their new home
Since it's built with such strong, loving care.

The wedding was wonderful!
Flowers and friends
Filled the room and spilled out on the lawn.
Lots of people said prayers
And I felt their home grow
As bricks piled up for Jessie and John.

When she left, Jessie whispered,
"You're part of me always."
She hugged me real tight on her way.
Then I whispered back,
"I'll sing 'O Son of Man!'
And build blocks for your house every day."

I still miss my sister
But she was quite right.
We really are not far apart
Because when I'm building
Some bricks with my prayers,
I can feel her right here in my heart.`,
    excerpt: "I sure miss my sister\nShe's moving away.\nPretty soon, all her things will be gone.\nHer room next to mine\nWill be empty and echo.\nToday, she was m",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "everyone",
    title: "Everyone",
    content: `Everyone laughs
Everyone cries
Everyone giggles
Everyone sighs
No matter our outsides
Our father or mother
We really and truly
Belong to each other

Everyone hurts
Everyone grins
Everyone loses
Everyone wins
Fat, tall, thin, short
In one shade or another
We really and truly
Belong to each other

Everyone thinks
Everyone knows
Everyone touches
Everyone grows
In each shining face
Is a sister or brother
We really
And truly
Belong to each other`,
    excerpt: "Everyone laughs\nEveryone cries\nEveryone giggles\nEveryone sighs\nNo matter our outsides\nOur father or mother\nWe really and truly\nBelong to each oth",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "fairy-tale",
    title: "Fairy Tale",
    content: `Far, far away in the kingdom of Murth
Lived a king with two sons and a daughter.
The king called his male offspring the salt of the earth,
But his girl child was dearer than water.

One day, the king beckoned his children to him
And said, "Children, my heart's joy, my progeny,
I need to sort out, ere my mind becomes dim,
Simple truth from all kinds of hodge-podgeny.

"I'll set you a task, send you out for a week,
Unadvised, unprepared, on your own,
And the one who returns with the answer I seek
Wins the kingdom, the crown, and the throne."

"No problem," said Harry and Tom, the two boys.
"Just tell us the task we must do."
Miranda looked up from her books and her toys.
"I will do my best, Papa, for you."

"The task is quite simple. Now sharpen your mind
And your eyes as you scour the land.
The winner must bring the most fruits you can find
That will fit in the palm of my hand."

Young Harry and Tom both jumped up and left town
Before those who were watching could blink.
Miranda stopped reading and put her book down,
Then retired to have a good think.

Slowly and quickly the seven days passed.
The two boys scampered in from their questing
Very eager to share the small fruit they'd amassed.
In the throne room, Miranda was resting.

"What ho!" sang the boys as they drew near the throne.
"Was your search so unfruitful, our sister?"
And thinking that she had failed, out on her own,
They leaned over and quietly kissed her.

Miranda just smiled. "Welcome home," said the king.
"Let us see what your journeys have wrought."
And from packages tied up with paper and string,
The boys pulled forth the fruit they had brought.

In Harry's large hand sat sweet cherries galore.
"There are twenty that fit," he declared.
"I have many more grapes. In fact, I've thirty-four,"
Countered Tom as they looked and compared.

"Now, daughter, come forth," came the king's soft command.
As Miranda arose with aplomb.
A hush fell on the court. Then she opened her hand.
Three small seeds nestled in her plump palm.

"These seeds," she explained, "which in number are three,
Have no visible leaves, trunks, or roots.
But waiting in each is a new apple tree,
And each tree carries dozens of fruits."

"Brava!" cried the king. "Simple truth has been found.
May Miranda rule wisely and well."
Several cheers for Miranda arose all around
Like the sound of a deep-ringing bell.

Now in faraway Murth, daily classes are held
To teach folks in the kingdom to see
All the words that unfold when we spend time in thought
And find, deep in the seed, a new tree.`,
    excerpt: "Far, far away in the kingdom of Murth\nLived a king with two sons and a daughter.\nThe king called his male offspring the salt of the earth,\nBut his",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "family-fun",
    title: "Family Fun",
    content: `Just once a year, my family
Decides to break a rule.
We pick a hot, hot August day
Before we're back in school.

Instead of dinner, we pile in
Our car to take a ride.
We stop before the ice cream store
And all end up inside.

"I'll have vanilla!" "Mocha chip!"
"Mine's tutti frutti lite!"
Then out we go to taste and crunch up
Every single bite.

We slurp each drip and lick all round.
We burp sometimes, or hum.
We always laugh and smile about
More flavors that could come:

Superman and bubble gum
Mint double fudge royale,
White House cherry, maple mousse,
And caramel fudge lo-cal.

That's not the end. O no it's not!
We're soon inside the store,
Each choosing one more yummy cone.
Then maybe just one more.

When finally we've had our fill,
We head home to our beds.
We stretch out full and dream of fun
And ice cream in our heads.

It's such a treat to go to sleep
With stomachs round and cool.
I love our one-time ice cream meal
Before we're back in school.`,
    excerpt: "Just once a year, my family\nDecides to break a rule.\nWe pick a hot, hot August day\nBefore we're back in school.\n\nInstead of dinner, we pile in\nOur c",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "grandpas-hat",
    title: "Grandpa's Hat",
    content: `High up in my room was an old sailor hat
Just gathering dust on the shelf,
And sometimes I wondered just why it was there,
And why it was all by itself.

One day, I was working at being a pirate
And took that hat down for my head.
The dust was so thick that I sneezed, "Ker-ty-shoo!"
And it flew back behind my old bed.

"Yo ho ho," I cried out. "No old cloth hat for me.
I'll find something more grand with a feather."
So I rummaged around, and I found what I wanted—
A mighty hat all made of leather.

One day, my old grandpa came by to say hi,
And he visited me where I play.
So I put on my pirate clothes, "Hardy har har,"
While he signed up as mate for the day.

"When I were a lad, I sailed far," Grandpa said,
"And the fittest of craft it were, too.
I wore on me head a white hat made of cloth
And me dress suit was all navy blue.

"O the people I rescued, the dolphins I saved,
And the whales I helped turn from their death.
I'll never forget serving on the high seas,
And 'tis proud I'll be 'til me last breath."

Just then, I remembered the hat on the floor.
I ducked under and brought it to light.
My grandfather's eyes started twinkling and sparkling
Like stars on a crisp, cloudless night.

"I miss seeing this fella," he said with a wink.
"Thought maybe you'd thrown it away.
This old hat is worth more than me whole weight in gold,
Though it's starting to turn a bit gray.

"Now, it used to be here," and he pointed way up,
Then stood stretching and dusting the shelf
'Til the hat was returned to its most honored place
In the highest spot, all by itself.

Now grandpa comes up to my room every day
And he always has stories to tell
About sailing the seas, about bold, loving deeds,
And the hat that he still loves so well.`,
    excerpt: "High up in my room was an old sailor hat\nJust gathering dust on the shelf,\nAnd sometimes I wondered just why it was there,\nAnd why it was all by i",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "hooray-for-skin",
    title: "Hooray for Skin",
    content: `Rejoice, and celebrate the skin
That keeps the veins and muscles in
That keeps the cold and germies out.
That is what skin is all about.

Suppose, when God created skin,
He turned the skin-side outside in
So when you talk to Mrs. Jones
Your eyes meet over fat and bones

And tissues, blue and white and red,
That stretch from toe to hand to head.
It makes me glad to have a skin
To keep the outside bone-side in.

Now there are folks who would be mad
If our insides were all they had
To tell all kinds of folks apart.
Perhaps they'd learn to read the heart
Instead of judging from a hue
If that one's false or this one's true.

Let's all join hands and feast our eyes
On skins of every shape and size
Of every tone of gold or white
Of luscious black, of dark or light,
Of every shade that folks come in.
Rejoice, and celebrate the skin!`,
    excerpt: "Rejoice, and celebrate the skin\nThat keeps the veins and muscles in\nThat keeps the cold and germies out.\nThat is what skin is all about.\n\nSuppose",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "lost-and-found",
    title: "Lost and Found",
    content: `I thought I lost my shoe today.
It hid and made me late for play.
I searched and searched and found it where
I'd left it, underneath my chair.

I thought I lost my tooth today.
It fell right on my bed and lay
Right there 'til Jessie jumped on top.
We found it with the duster mop.

I thought I lost my dog today.
I told him that he had to stay
And wait for me. But he forgot.
I found him in the parking lot.

I thought I lost my star today.
"We'll find it, hon," I heard Mom say.
And do you know? My mom was right.
It's shining where it was last night.

I thought I lost my heart today.
I prayed so hard it flew away.
I missed my heart until I saw
It cradled by 'Abdu'l-Bahá.

I lost so many things today.
My dad says some days go that way.
So I'm confused. Which can it be?
Did I lose them, or they lose me?`,
    excerpt: "I thought I lost my shoe today.\nIt hid and made me late for play.\nI searched and searched and found it where\nI'd left it, underneath my chair.\n\nI t",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "my-grampa-and-i",
    title: "My Grampa and I",
    content: `My grampa and I
Are the bestest of chums.
We both run outside
When the ice cream man comes.
We even have long, kind of bendy-back thumbs,
My grampa
My grampa and I.

My grampa and I
Hunt for mushrooms and rocks
When we're walking together.
And Dad says our socks
Are all smelly from wading in mud by the docks,
My grampa
My grampa and I.

My grampa and I
Like our fireworks loud
Search for men in the moon
And the moon through a cloud.
And when we do dishes, we do ourselves proud,
My grampa
My grampa and I.

My grampa and I
Have decided to be
Like two peas in a pod,
Like a lock and a key.
And I'll always love him and he'll always love me,
My grampa
My grampa and I.`,
    excerpt: "My grampa and I\nAre the bestest of chums.\nWe both run outside\nWhen the ice cream man comes.\nWe even have long, kind of bendy-back thumbs,\nMy gramp",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "my-nana-is-perfect",
    title: "My Nana Is Perfect",
    content: `My nana sings in bathtubs
and toy stores
and parking lots.

My nana gives me presents
and toothpaste
and polka dots.

My nana takes me shopping
and swinging
and to the zoo.

My nana likes my drawings
my dollhouse
my kangaroo.

My nana's good at napping
and popcorn
and picture books.

My nana's brave with splinters
And spiders
And fishing hooks.

My nana hides the band-aids
and lipstick
and china dolls.

My nana gets things backwards
like slippers
and overalls.

My nana feeds me liver
and okra
and barley grass.

My nana cries at soccer
and play group
and dancing class!

But when the rocker holds us
And stars are dressed in sparkles,
I snuggle with my nana
And give her tiny kisses.

She sings about a baby
A-rockin' in her cradle
And tells me how my elbows
Are so much like my daddy's.

She says "I love you darlin'."
And I say, "Me too, Nana."

You see?
My nana is perfect.`,
    excerpt: "My nana sings in bathtubs\nand toy stores\nand parking lots.\n\nMy nana gives me presents\nand toothpaste\nand polka dots.\n\nMy nana takes me shopping\na",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "night-walk",
    title: "Night Walk",
    content: `The house is quiet, O so still.
The moon shines on my windowsill
And draws me out in silver light
To hear the language of the night.

The doves and owls, the crickets near
Are voices that I often hear
When moonlight waves its tempting hand
And I obey its soft command.

But on this night, the rustling trees
Sing different songs upon the breeze.
Tonight the woods out past the lawn
Cry out, "Where have the People gone?"

The People. Yes. The ones whose lands
Have passed to others' eager hands
The ones who sing Earth Mother's song
Not heard in this woods for so long.

The ones who tell the tales of dreams
Of sacred mountains, lakes, and streams.
Where are they now? I long to see
Their fires and lodges close to me.

Too soon the moon sets round and red.
I wander back to my warm bed.
I pray the People will return
That, hearts together, all might learn

The language of the earth and sky,
The songs of stars that pass me by,
The secret of the moonbeam's light
That calls me out to walk at night.`,
    excerpt: "The house is quiet, O so still.\nThe moon shines on my windowsill\nAnd draws me out in silver light\nTo hear the language of the night.\n\nThe doves an",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "the-reluctant-seed",
    title: "The Reluctant Seed",
    content: `In the dark, dark earth
Small Darcy Seed was all curled up,
Softly humming to himself throughout the spring.
How he loved his gentle life
With naught to do but rest and think
And smile and wait and giggle quietly and sing.

Above his head, below his knees,
His parents' roots gently entwined.
Yes, they loved their little seedling snuggling near.
But as the days rolled slowly by
And other seeds began to sprout,
The parents' thought began to turn to doubt and fear.

"Mr. Sun," they called out loud,
"What shall we do with our small seed?
He's lying happily, content to rest and hum."
"Where is his nest?" the sun inquired.
"I'll send out special warming rays.
He's just not ready, but his sprouts will surely come."

And, sure enough, old Mr. Sun
Glowed gently, thinking of the child,
And comfy, cozy, peaceful warmth flowed all around
That little sleepy Darcy Seed.
He turned his shell to feel the rays
Which softly, tenderly soaked through the cold, dark ground.

No shoots appeared. Now Mom and Dad
Were mighty worried once again.
"Suppose we call on Mrs. Rain to help us out?"
They raised their shiny, suppliant leaves.
"Dear Mrs. Rain, please shower down.
Our stubborn baby isn't growing. Not one sprout."

The soothing rain gave forth her best,
Most charming raindrops to the seed.
Darcy turned once more and let the drops seep in.
And, really, quite against his will,
The hardened seed began to swell.
Darcy yawned and felt a stretching urge begin.

In the dark, dark earth,
Darcy Seed stuck out a root.
It was so tiny that it almost didn't show.
Mr. Sun and Mrs. Rain
Had worked their magic once again.
Small Darcy Seed felt loved enough to crack and grow.

You should see him now.
Darcy Seed is one fine plant.
Healthy roots and shiny leaves have blossomed out.
Darcy loved the peace
Of the dark, dark earth,
But he gave it up to take a chance and sprout.`,
    excerpt: "In the dark, dark earth\nSmall Darcy Seed was all curled up,\nSoftly humming to himself throughout the spring.\nHow he loved his gentle life\nWith nau",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
  {
    id: "which-wealth",
    title: "Which Wealth?",
    content: `Have you heard the story told
Of how a king turned things to gold,

Turned all to gold with one small touch?
King Midas loved this gift so much!

He touched his cup. (I'm sure you know.)
He touched his bed. He touched his bow.

He touched his table, rug, and chair,
His soup, his cheese, his grapes, his hair!

He whirled around in joyous fun
And reached to touch his dearest one,

His precious child. Alas, alack!
She turned to gold! "O give me back,"

The one whose love lights up my way!"
His wish was granted. Happy day!

Now do you think our king was sad?
No! Gold was gone, but he was glad.

He'd found that love was irreplaceable
And gold, mere gold was, well, erasable.

Sometimes I wonder just how much
I would enjoy the golden touch.

Would I have chosen, if I could,
The gold for now, or love for good?`,
    excerpt: "Have you heard the story told\nOf how a king turned things to gold,\n\nTurned all to gold with one small touch?\nKing Midas loved this gift so much!\n\n",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'family' as const,
  },
];