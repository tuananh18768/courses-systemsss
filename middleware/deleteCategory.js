// const deleteCate = (req, res) =>{
//     return Project.findById(req.params.id, function(err, project){
//           return project.remove(function(err){
//               if(!err) {
//                   Assignment.update(
//                       {_id: project.assignment}}, 
//                        {$pull: {projects: project._id}}, 
//                            function (err, numberAffected) {
//                              console.log(numberAffected);
//                        } else {
//                          console.log(err);                                      
//                      }
//                    });
//              });
//          });