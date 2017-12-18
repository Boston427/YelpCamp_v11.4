var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var  data = [
	{
		name: "Cloud's Rest", 
		image: "https://images.pexels.com/photos/216678/pexels-photo-216678.jpeg?h=350&auto=compress&cs=tinysrgb",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium porro, veritatis cumque hic suscipit neque facilis placeat voluptates ipsum excepturi. Deserunt voluptatum, laboriosam nemo animi ex nobis quasi dolore exercitationem possimus. At non, nostrum. Molestias itaque ipsam minima ipsa repellat eveniet aliquid facilis cum, eos eum repudiandae nulla labore praesentium!" 
	},
	{
		name: "Light of Stars", 
		image: "https://images.pexels.com/photos/93858/pexels-photo-93858.jpeg?h=350&auto=compress&cs=tinysrgb",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt omnis obcaecati eius quos delectus deleniti saepe repellat hic! Eos cum, assumenda officiis a provident sequi, deleniti laboriosam soluta amet dolorem laudantium fuga fugiat minus quos id odit atque, veritatis facilis aliquam ratione explicabo temporibus! Voluptates cumque aut similique laborum atque."
	},
	{
		name: "Tree Valley", 
		image: "https://images.pexels.com/photos/6714/light-forest-trees-morning.jpg?h=350&auto=compress&cs=tinysrgb",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus ipsam beatae, eaque ad vitae at quasi, suscipit! Quas ducimus facilis inventore? Magnam labore et, incidunt! Iure eum incidunt, suscipit dolore laborum, possimus voluptatum quidem quasi magnam autem quam est a quos doloribus beatae hic voluptates ratione similique qui iusto aut."
	}
]
function seedDB(){
	// Remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!");
		// add a few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err);
				} else {
					console.log('added a campground');
					// create a comment
					Comment.create(
						{
							text: "This place is great, but I wish there was internet.",
							author: "Homer"
						}, function(err, comment){
							if(err){
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment");
							}
						});
				}
			});
		});
	});
}

module.exports = seedDB;