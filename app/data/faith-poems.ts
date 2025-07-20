export interface FaithPoem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  copyright: string;
  category: 'faith';
  audioUrl?: string;
}

export const faithPoems: FaithPoem[] = [
  {
    id: "a-letter-from-god",
    title: "A Letter from God",
    content: `You are so lucky. So lucky am I.
Each year, as the first breath of spring passes by
The mailman, unknowing, delivers a gift.
It is—ready?—a letter from God.

Now God doesn't write from a desk with a pen.
He has, working in Haifa, nine trustworthy men.
And when they're together, they listen and pray
'Til they all hear a letter from God.

The first lines sing songs of the good things we've done,
The goals we have finished, the victories we've won.
Tender words, strong and clear, call each soul to new tasks.
Precious music, a letter from God.

So tonight, when your family is comfy and near
By a fire, a cool breeze, any place that is dear,
Ask for one special gift to be read right out loud:
Ridván's message, a letter from God.`,
    excerpt: "You are so lucky. So lucky am I.\nEach year, as the first breath of spring passes by\nThe mailman, unknowing, delivers a gift.\nIt is—ready?—a letter",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "a-rock-is-patient",
    title: "A Rock Is Patient",
    content: `A rock is patient
It sits through lightning, snow and grime
Rocks don't complain, they take the time to change
A rock is patient

A plant is patient
A seed grows when the time's just right
It knows the day's for sun, the night's for rest
A plant is patient

A cow is patient
It stands all day to chew and eat
It gives us milk in cold and heat and rain
A cow is patient

Sometimes I'm patient
When people ask, I stop and wait
Sometimes it's hard, but it feels great to know
I can be patient

The Master was patient
He did just what God asked him to
I hope I grow up like 'Abdu'l-Bahá
For He was patient`,
    excerpt: "A rock is patient\nIt sits through lightning, snow and grime\nRocks don't complain, they take the time to change\nA rock is patient\n\nA plant is patien",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "center-of-the-covenant",
    title: "Center of the Covenant",
    content: `As the moon to the sea,
Gentle rain to the withered land,
Tender touch to a yearning hand,
So you are to me,

O Master, Mystery of God,
Center of the Covenant

As the wind to the tree,
Loving glance to a lonely heart,
Beck'ning hand to a child apart,
So you are to me,

O Master, Mystery of God,
Center of the Covenant

As the earth to the seed,
Mirror pure to a tarnished soul,
Brilliant flame to the brittle coal,
So you are to me,

O Master, Mystery of God,
Center of the Covenant`,
    excerpt: "As the moon to the sea,\nGentle rain to the withered land,\nTender touch to a yearning hand,\nSo you are to me,\n\nO Master, Mystery of God,\nCenter of",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "evening-prayer",
    title: "Evening Prayer",
    content: `Like jasmine in summer
Like jewels in a crown
Perfections of perfume and light
Asíyih, Bahíyyih, Munírih Khánum,
Surround us and guide us this night.

Dear mother, dear sister,
Dear daughter and wife,
The tales of your service live on.
The light of the candle you lift to our eyes
Illumines the dark before dawn.

With deepest of yearning
With highest of hope
We search for your lives in our own.
And if we are lucky and blessed with His grace,
We'll follow your path to our home.`,
    excerpt: "Like jasmine in summer\nLike jewels in a crown\nPerfections of perfume and light\nAsíyih, Bahíyyih, Munírih Khánum,\nSurround us and guide us this n",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "feast-at-my-house",
    title: "Feast at My House",
    content: `Silver polished
Dishes gleaming
Candles glowing
Rice pot steaming
Prayers practiced
Napkins creased
Soon my friends
Will come to Feast

Roses' scent fills
Rooms and halls
Chairs unfolded
Line the walls
Teapot bubbles
Vacuum hums
Just can't wait
'Til everyone comes

Doorbell ringing
Love and laughter
Sacred verses
Music after
Questions answered
Joy released
My house and I,
We love the Feast`,
    excerpt: "Silver polished\nDishes gleaming\nCandles glowing\nRice pot steaming\nPrayers practiced\nNapkins creased\nSoon my friends\nWill come to Feast\n\nRoses'",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "following-in-mulla-husayns-footsteps",
    title: "Following in Mullá Husayn's Footsteps",
    content: `The stars had fallen.
The time had come
For people to search
For the Promised One.

He raised the call,
Did Mullá Husayn.
But people stayed still.
"You go. We'll remain."

So Mullá Husayn
Was the first one to leave
With his brother and nephew
Who also believed.

Before they went far,
Near that very first day,
They stopped forty more
Just to fast and to pray.

To fast and to pray,
And then to decide
Which road to explore,
Where to walk, where to ride.

From city to city,
From valleys to peaks,
They searched for the Promised One
More than twelve weeks.

'Til finally they came,
All dusty and worn,
To the town of Shiráz
Where a new faith was born.

Yes, a new faith was born
In Shiráz on that day.
And Mullá Husayn,
Who'd come such a long way

With no map and no compass
With barely a clue
Had relied on his heart
To decide what to do.

His journey was ended.
The Báb was his goal.
And the Báb's Revelation
Brought joy to his soul.

O how I do wish
That I'd been there that night,
Had heard the Báb chant,
Had been bathed in His light.

Instead, every year
As the months turn to May,
I imagine the quest
And the long, unknown way,

The faith and the knowledge⎯
The heart and the brain⎯
That guided the footsteps
Of Mullá Husayn.`,
    excerpt: "The stars had fallen.\nThe time had come\nFor people to search\nFor the Promised One.\n\nHe raised the call,\nDid Mullá Husayn.\nBut people stayed still.",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "he-gave-himself-away",
    title: "He Gave Himself Away",
    content: `All His life, every moment of every day,
'Abdu'l-Bahá gave His possessions away.
And with every present, His love went along.
His dearest desire was to right every wrong,
Give food to the sick, pay for doctors and pills.
He'd visit and bathe them, whatever their ills.

He'd offer His bed, or His trousers or cloak
To bring comfort and warmth to some very poor folk.
When people had problems that needed the law,
He paid for a lawyer for justice for all.

Sometimes, when His family had started to eat,
He would hear of some people with no rice or meat.
His heart would be saddened, and up He would stand
And would take them His food with His very own hand.

He handed out money to help those in need,
Prevented starvation by giving out seed
To be planted and nurtured and grown into corn.
No need was too small. He helped all the forlorn.

To serve the Bahá'ís, He would stay up to write
And to pray for their efforts far into the night.
It isn't so strange, then, at seventy-seven,
'Abdu'l-Bahá rose to His Father in heaven.
Because every moment of every day
'Abdu'l-Bahá just gave Himself all away.`,
    excerpt: "All His life, every moment of every day,\n'Abdu'l-Bahá gave His possessions away.\nAnd with every present, His love went along.\nHis dearest desire w",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "holy-day-vision",
    title: "Holy Day Vision",
    content: `I'm supposed to try to take a rest
Before we gather, remembering Him
But the stars are sparkling their very best
And I can't seem to close my eyes.

In just a few hours, the music will ring
As we all gather, remembering Him,
And the voices of choirs and birds will all sing
From the earth to the shimmering skies.

From the foot of the hill, from the edge of the sea
Will come candles and roses and big pots of tea.
Our neighbors, our friends, and our whole family,
Will gather for comfort and prayer.

His trials are over. We think of them still
As we all gather, remembering Him.
I'm sure I hear angels with voices that thrill,
Chanting verses that spread through the air.

Come over as soon as dad says it's all right
Before everyone gathers, remembering Him
And watch with me here as we wait for this night
The Ascension of 'Abdu'l-Bahá.`,
    excerpt: "I'm supposed to try to take a rest\nBefore we gather, remembering Him\nBut the stars are sparkling their very best\nAnd I can't seem to close my eyes.",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "taking-courage",
    title: "Taking Courage",
    content: `Remember the day that you took your new bat,
Swung it high in the branches, just missing the cat?
When it fell, the car's headlight was right in its way.
You found me and told me the truth right away.
That took courage.

Remember when Juana and you saw the games?
A whole busload of kids started calling her names
You stayed close beside her, yes, stood by her side
Refusing to leave her 'til she had a ride.
That took courage.

Remember when everyone thought you weren't cool
Cuz you went to Bahá'í class each day after school?
Kids called you "Be High," but you went anyway
And didn't complain that you'd just rather play.
That took courage.

When the Master was little, He often was chased
By young boys with big stones, until one day He faced them
And ran toward them shouting. That scared them a lot.
So they ran far away, thinking they might get caught.
He had courage.

When I think of my life and the people I know,
Old and young, large and small, weak and strong, fast and slow.
They all have their strengths. They have things they do best.
And I know there's one virtue you show in a test.
You have courage.`,
    excerpt: "Remember the day that you took your new bat,\nSwung it high in the branches, just missing the cat?\nWhen it fell, the car's headlight was right in it",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "the-day-of-the-bab",
    title: "The Day of the Báb",
    content: `When the Báb was a child,
And, invited to play,
He often would choose
To sit calmly and pray.

His teacher discovered
His spiritual mind
That needed no school
Of the usual kind.

At work every day
In the busy bazaar,
All could see the Báb's honesty
Shine like a star.

And when the Báb married,
He showered His wife
With a love that would last
Far beyond His short life.

What was there to fear then
From this gentle man?
I don't understand
How His troubles began.

But troubles there were
From some men who were blind
To the One Who was promised,
So tender, so kind.

They shut Him in prisons.
They left Him no light
For comfort or writing
Or heat in the night.

And finally they killed Him,
Anis at His side,
This shining young Man
Who had nothing to hide.

Oh yes, shots were fired.
And, yes, it was done.
The Báb lost His life
In Tabríz in the sun.

But every July, child,
We cherish His light.
For the Day of the Báb
Won't be followed by night.`,
    excerpt: "When the Báb was a child,\nAnd, invited to play,\nHe often would choose\nTo sit calmly and pray.\n\nHis teacher discovered\nHis spiritual mind\nThat nee",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "the-gnats-challenge",
    title: "The Gnat's Challenge",
    content: `Gnorman the Gnat was born in a swarm
On a sultry summer's day.
His parents said, "My, what a tiny young thing!"
Which, for gnats, was not gnormal to say.
But, dwarfish or huge, Mom and Dad didn't care
And rocked Gnorman to sleep in the hay.

Gnext morning, young Gnorman awoke before dawn.
He opened his tiny mouth wide
And surprised all the gnats fast asleep in their beds
With three small words. "I'll grow up," he cried.
His parents said, "My, what a forward young thing!"
And they beamed at his person with pride.

Short Gnorman grew older, and soon came to see
That most gnats thought his smallness was bad.
So he ordered some weights and began to work out
Every evening along with his dad.
He grew limber and bulged with diminutive muscles
Gno gnat in gnat history had.

The swarm was impressed. His friends pointed him out
To all visitors, fruit flies, and fleas.
But mere muscles could gnever quite quench his desire
To grow bigger than inchworms or bees.
So, despairing, he sought the advice of a friend.
"Help me grow, Mr. Owl, will you please?"

The owl blinked an eye. "You must strengthen your brain.
Exercise both your arms and your head."
Gnorman jumped to his feet and ran home to his books
And his weights. "Yes, I will grow," he said.
He devoured the tomes in the Insect Archives.
Gne'er a gnat had a mind more well-fed.

One day, Gnorman was working and thinking outside
And he lifted his eyes to the sky.
There he saw a great eagle soar high on the wind,
And his tiny heart gave a small sigh.
"How I wish I could grow up to be a great bird."
And a tiny tear rolled from his eye.

Loud thunder crashed suddenly, shaking the earth,
And a Voice was heard ringing and clear:
"Your brain and your body are ready for Me,
But your heart is the prize I hold dear."
"W-Will you help?" Gnorman whispered. "I'll work on my heart."
His lips and knees quivered with fear.

"I am with you," the Voice said, and faded away.
Gnorman felt waves of happiness come.
And his heart was so large and so gnew and so loud
That it beat with the boom of a drum.
The sound of it caused many gnats to draw near.
Tiny Gnorman began a grand hum.

As the humming swelled out, the whole swarm gasped aloud.
Gnorman's body and brain started growing,
And he grew and he grew until gnot one gnat knew
Where the body of Gnorman was going.
Pretty soon, all the gnormal gnat parts were all gone
And some feathers were all that were showing.

A large head, two strong wings, and some talons appeared.
"It's an airplane!" one gnat cried. "A bird!"
"I'm an eagle, an eagle! At last I have grown!"
And those shouts were the last that were heard
Above all of the clapping and roaring and laughing.
How deeply the gnats' hearts were stirred.

Many times, late at gnight, as the gnats gather 'round
To tell stories and sing in the hay,
Grandma Gnat tells the tale of small Gnorman who grew
On that great, unforgettable day,
From a gnat to an eagle of very large size.
Or so all the older folk say.`,
    excerpt: "Gnorman the Gnat was born in a swarm\nOn a sultry summer's day.\nHis parents said, \"My, what a tiny young thing!\"\nWhich, for gnats, was not gnormal ",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "the-invitation",
    title: "The Invitation",
    content: `"Dear Pen Pal," I wrote yesterday
Just putting my thoughts down,
"I got an invitation from
The Assembly in my town."

"They asked if they could see me.
Well, I wondered what I'd done.
I wondered if I'd broken laws.
Had gossip struck my tongue?"

"With pounding heart and fearful thoughts
I read the printed words:
'Please come to our next meeting
On September twenty-third.'"

"The day arrived. I can't describe
How nervous I was feeling.
I knew that if I heard a 'Boo'
I'd jump right through the ceiling."

"Well then, dear Pen Pal, what came next
Surprised me to the core.
Every person welcomed me
As I came through the door."

"They said, 'Dear Fred, we're very glad
To see that you could come.
Would you please read your favorite prayer
To bless our meeting's home?'"

"I never knew that these nine folks
Would show me such respect.
But why was I invited there?
You never will suspect!"

"They'd heard that I had teaching goals
And asked if I would share
The things I'd learned, my small success,
At Feast, after the prayers."

"By this time, I was feeling great,
Wrapped 'round with tender care.
I wondered why I'd worried so.
I felt such safety there."

"You know what?" I wrote happily,
"If someday you should look
To find an answer you can't find
From any friend or book."

"Ask your Assembly. They all help
The people where you live.
I really wish you'd been with me
To feel the love they give."

"Dad says that you can visit soon.
Bring LEGO blocks and skates.
We'll have a snack so we can use
My superhero plates."

"Chinchilla barked. Remember him?
It must be time for bed.
Don't ever let the bedbugs bite.
Sincerely, your friend Fred."`,
    excerpt: "\"Dear Pen Pal,\" I wrote yesterday\nJust putting my thoughts down,\n\"I got an invitation from\nThe Assembly in my town.\"\n\n\"They asked if they could se",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "the-old-ships-tale",
    title: "The Old Ship's Tale",
    content: `Away back bay where worn ships go
When they are feeling old and frail,
The evening air is often filled
With many a wild, adventurous tale
Of dark-souled pirates, storms, and ghosts
The ships have seen in sailing time.
One rig sits silent at the dock—
The S.S. Cedric of the White Star Line.

One night, a snub-nosed tug bounced up
And, giggling with a high-pitched peep
Cried out, "The ship at old pier five
Is cracked and senile, fast asleep."
The liners laughed. The brigantines
All sneered and cracked their masts in time,
And every rigger ridiculed
The S.S. Cedric of the White Star line.

The darkness deepened. Silence fell.
Then northern lights began to play
On wave and water, ship and sky
Until the air was light as day.
And from the pier marked number five
A voice sang, "I recall the time . . ."
"Who spoke?" squealed Tug. Then, "It is I,
The S.S. Cedric of the White Star Line."

Now, shocked, the ships stirred at their docks.
They listened reverently and still
As the old ship spoke of a mighty voice,
Majestic steps that made decks thrill,
And love outshining lighthouse beams
Throughout the passing years of time.
"I carried the Master in 1912," sighed
The S.S. Cedric of the White Star Line.

Away back where the worn ships go
A warmth has settled on the pier.
And all the steamers, scows, and schooners
Sleep all day, then gather near
Old number five when sunset comes.
And there they lose all track of time
As they hear of the journey of 1912 from
The S. S. Cedric of the White Star Line.`,
    excerpt: "Away back bay where worn ships go\nWhen they are feeling old and frail,\nThe evening air is often filled\nWith many a wild, adventurous tale\nOf dark-",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "the-secret-place",
    title: "The Secret Place",
    content: `I have a secret hiding place.
I know you'd like to see
The shining little secret door,
The tiny golden key.

My secret room is found atop
A secret winding stair
And here I listen for the Friend
Who comes to join me there.

I often clean my secret place
With mop and brush and broom
Until the cozy glow of love
Lights up my secret room.

With dust and cobwebs whisked away,
A flowered carpet grows
Where secret seeds have given way
To hyacinth and rose.

A fire is kindled in the hearth.
Soft-pillowed chairs embrace
My Friend and me as we both sing
To bless my secret place.

Now I've been told that everyone
Can find his secret door.
The tiny key is waiting where
No one had looked before.

To find it, simply close both eyes.
The secret treasure chart
Is waiting in the sacred words
That live inside your heart.`,
    excerpt: "I have a secret hiding place.\nI know you'd like to see\nThe shining little secret door,\nThe tiny golden key.\n\nMy secret room is found atop\nA secret",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "the-sweetest-word",
    title: "The Sweetest Word",
    content: `I heard a brand new word today
I'd never heard before.
My mom and dad were talking
And I heard them through the door.
Their voices sounded happy
Quietly—no "Ha ha ha!"
They almost sang that special magic word:
Huqúqu'lláh

i wonder what the word can mean
And why I feel so glad.
Is this new word a present?
"Such a gift!" whispered my dad.
They always get excited
Chanting, "O Bahá'u'lláh"
I'm sure He must have given this to us:
Huqúqu'lláh

Tonight when I am ready
For my prayer and Hidden Word,
I'll tell my mom and dad
About their talk I overheard
And if they think I'm much too young
I'll ask 'Abdu'l-Bahá
To tell me in my dreams about this sweet
Huqúqu'lláh`,
    excerpt: "I heard a brand new word today\nI'd never heard before.\nMy mom and dad were talking\nAnd I heard them through the door.\nTheir voices sounded happy\nQ",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "to-elect-the-house-of-justice",
    title: "To Elect the House of Justice",
    content: `Imagine them coming to Haifa in spring
O bright, golden dome
White arc on the mountain
They fly to the airport
They sail into harbor
To elect the House of Justice

Imagine the faces—a world in a room.
The smiles and the greetings
As family arriving
In caftans and business suits
Saris and muu-muus
To elect the House of Justice

Imagine the silence as everyone prays
Which nine men are waiting
And how will they serve?
Each heart is reflecting
Each hand fills a ballot
To elect the House of Justice

Imagine that someday, we'll all vote for people
Who'll vote for the people
Who'll travel to Haifa
Who'll gaze on the mountain
Who'll open their hearts
To elect the House of Justice`,
    excerpt: "Imagine them coming to Haifa in spring\nO bright, golden dome\nWhite arc on the mountain\nThey fly to the airport\nThey sail into harbor\nTo elect the ",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "waiting-at-bahji",
    title: "Waiting at Bahjí",
    content: `The shoes were whispering on the stair.
"Did you see it? Did you see
The tall black gates with curlicues?"
The loafers asked, "And peacock's blues?"
"We see the gold above the door," exclaimed a shiny pair.

Two moccasins arose to speak.
"Did you feel it? Did you feel
The rough and crunchy crushed up tiles
On every path?" "It seemed like miles,"
Smiled bright red clogs with coal black toes. "Do all your soles feel weak?"

"We saw a wonder," spoke two heels.
"Did you see it? Did you see
The rosebush and the cactus flower
Content to snuggle, hour on hour?
We've never felt a garden feel the way that this one feels."

Then shoes began to jump and shout.
Tongues were wagging, tongues were flapping.
All the shoes, that is, but two
A well-worn pair of scruffy blue
From whose wet laces, loosely strung, the tears flowed round about.

"My friends," the shoes began with grace—
The loud tongues slowed. They slowed and stopped—
"If you will join me in a prayer,
The awe and power in the air
Will surely bless us, every one, in such a sacred place."

Shoes settled in upon the stair—
All was quiet, very quiet—
Waiting for the feet inside
Who, filled with love and shorn of pride,
Would join their friends, their faithful shoes, transforméd, every pair.`,
    excerpt: "The shoes were whispering on the stair.\n\"Did you see it? Did you see\nThe tall black gates with curlicues?\"\nThe loafers asked, \"And peacock's blu",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "when-bahaullah-was-born",
    title: "When Bahá'u'lláh Was Born",
    content: `One day at dawn
A Child was born
A quiet Child
A royal Child
A Light from God had come to Earth
That dark November morn.

His mother said
He never cried.
Amazing Child
Contented Child
The Prince of Peace, a gift from God,
Had come to be our Guide.

This quiet Child
Would use no sword
No angry voice
No pounding fists.
He grew to use a Pen of Might
To share God's sacred Word.

We celebrate
That wondrous morn
Because the Child
That quiet Child
Bahá'u'lláh, a gift from God,
The Promised One was born.`,
    excerpt: "One day at dawn\nA Child was born\nA quiet Child\nA royal Child\nA Light from God had come to Earth\nThat dark November morn.\n\nHis mother said\nHe never",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
  {
    id: "wisdom",
    title: "Wisdom",
    content: `Oliver was witty
And Oliver was cute.
When Oliver was six years old
He learned to play the flute.
But Oliver would not obey.
He always broke the law.
His mom said, "Time to close your eyes
And meet 'Abdu'l-Bahá."

He closed his eyes up tightly.
He clasped his hands and prayed.
A voice came thundering through his ears:
"Rules are to be obeyed."
Then Oliver heard laughter.
He smiled and blinked his eyes.
In that short time his heart had learned
To listen and be wise.

Now Oliver remembers
The laughter and the voice.
He tries to do the wisest thing
When given a free choice.
He's learned to listen and obey
When Mom explains the law.
He still is cute, still plays the flute
And loves 'Abdu'l-Bahá.`,
    excerpt: "Oliver was witty\nAnd Oliver was cute.\nWhen Oliver was six years old\nHe learned to play the flute.\nBut Oliver would not obey.\nHe always broke the l",
    copyright: "By Susan Engle, Copyright 2021",
    category: 'faith' as const,
  },
];