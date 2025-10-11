const parseFormData = (req, res, next) => {
  // Parse nested object fields from FormData
  const parseNestedFields = (body) => {
    const parsed = { ...body };
    
    // Parse address object
    if (parsed.address) {
      const address = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('address[') && key.endsWith(']')) {
          const fieldName = key.slice(8, -1); // Remove 'address[' and ']'
          address[fieldName] = parsed[key];
          delete parsed[key];
        }
      });
      if (Object.keys(address).length > 0) {
        parsed.address = address;
      }
    }
    
    // Parse nearbyLocalities object
    if (parsed.nearbyLocalities) {
      const nearbyLocalities = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('nearbyLocalities[') && key.endsWith(']')) {
          const fieldName = key.slice(17, -1); // Remove 'nearbyLocalities[' and ']'
          nearbyLocalities[fieldName] = parsed[key] === 'true' ? true : parsed[key] === 'false' ? false : parsed[key];
          delete parsed[key];
        }
      });
      if (Object.keys(nearbyLocalities).length > 0) {
        parsed.nearbyLocalities = nearbyLocalities;
      }
    }
    
    // Parse projectDetails object
    if (parsed.projectDetails) {
      const projectDetails = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('projectDetails[') && key.endsWith(']')) {
          const fieldName = key.slice(15, -1); // Remove 'projectDetails[' and ']'
          projectDetails[fieldName] = parsed[key];
          delete parsed[key];
        }
      });
      if (Object.keys(projectDetails).length > 0) {
        parsed.projectDetails = projectDetails;
      }
    }
    
    // Parse approvals array
    if (parsed.approvals) {
      const approvals = [];
      const approvalMap = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('approvals[') && key.includes(']')) {
          const match = key.match(/approvals\[(\d+)\]\[(\w+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!approvalMap[index]) {
              approvalMap[index] = {};
            }
            approvalMap[index][field] = parsed[key];
            delete parsed[key];
          }
        }
      });
      
      // Convert map to array
      Object.keys(approvalMap).forEach(index => {
        const approval = approvalMap[index];
        if (approval.name && approval.number) {
          approvals.push(approval);
        }
      });
      
      if (approvals.length > 0) {
        parsed.approvals = approvals;
      }
    }
    
    return parsed;
  };
  
  req.body = parseNestedFields(req.body);
  next();
};

module.exports = parseFormData;
