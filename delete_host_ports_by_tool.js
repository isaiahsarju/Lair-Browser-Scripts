var deleteHostPortsByTool = function (ipAddr, lastModBy) {
  // Looks at a provided host and deletes any port by 
  // specified 'Last Modified By' value.
  // Useful if a scanner adds large sum of bad ports.
  //
  //
  // Usage: deleteHostPortsByTool('192.168.1.141', 'nexpose')
  // Created by: Ryan Dorey
  // Requires client-side updates: true

  var PROJECT_ID = Session.get('projectId')

  var host = Hosts.findOne({
    'project_id': PROJECT_ID,
    'string_addr': ipAddr
  })
  if (typeof host === 'undefined') {
    console.log('No matching host found')
    return
  }

  var ports = Ports.find({
    'project_id': PROJECT_ID,
    'host_id': host._id,
    'last_modified_by': lastModBy
  }).fetch()
  if (ports.length < 1) {
    console.log('No matching ports found')
  }

  ports.forEach(function (port) {
    console.log('Removing ' + port.protocol + '/' + port.port)
    Meteor.call('removePort', PROJECT_ID, port._id, function (err) {})
  })
  console.log('Total of ' + ports.length + ' port(s) removed.')
}
