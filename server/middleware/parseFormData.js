const parseFormData = (req, res, next) => {
  console.log('🔧 parseFormData middleware called');
  console.log('🔧 Original req.body:', JSON.stringify(req.body, null, 2));
  console.log('🔧 Content-Type:', req.headers['content-type']);
  
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
    
    // Parse headquarters object (for developers)
    if (parsed.headquarters) {
      const headquarters = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('headquarters[') && key.endsWith(']')) {
          const fieldName = key.slice(13, -1); // Remove 'headquarters[' and ']'
          headquarters[fieldName] = parsed[key];
          delete parsed[key];
        }
      });
      if (Object.keys(headquarters).length > 0) {
        parsed.headquarters = headquarters;
      }
    }
    
    // Parse contact object (for developers)
    if (parsed.contact) {
      const contact = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('contact[') && key.endsWith(']')) {
          const fieldName = key.slice(8, -1); // Remove 'contact[' and ']'
          contact[fieldName] = parsed[key];
          delete parsed[key];
        }
      });
      if (Object.keys(contact).length > 0) {
        parsed.contact = contact;
      }
    }
    
    // Parse socialMedia object (for developers)
    if (parsed.socialMedia) {
      const socialMedia = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('socialMedia[') && key.endsWith(']')) {
          const fieldName = key.slice(12, -1); // Remove 'socialMedia[' and ']'
          socialMedia[fieldName] = parsed[key];
          delete parsed[key];
        }
      });
      if (Object.keys(socialMedia).length > 0) {
        parsed.socialMedia = socialMedia;
      }
    }
    
    // Parse flagshipProjects array (for developers)
    if (parsed.flagshipProjects) {
      const flagshipProjects = [];
      const projectMap = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('flagshipProjects[') && key.includes(']')) {
          const match = key.match(/flagshipProjects\[(\d+)\]\[(\w+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!projectMap[index]) {
              projectMap[index] = {};
            }
            projectMap[index][field] = parsed[key];
            delete parsed[key];
          }
        }
      });
      
      // Convert map to array
      Object.keys(projectMap).forEach(index => {
        const project = projectMap[index];
        if (project.name || project.description) {
          flagshipProjects.push(project);
        }
      });
      
      if (flagshipProjects.length > 0) {
        parsed.flagshipProjects = flagshipProjects;
      }
    }
    
    // Parse team array (for developers)
    if (parsed.team) {
      const team = [];
      const teamMap = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('team[') && key.includes(']')) {
          const match = key.match(/team\[(\d+)\]\[(\w+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!teamMap[index]) {
              teamMap[index] = {};
            }
            teamMap[index][field] = parsed[key];
            delete parsed[key];
          }
        }
      });
      
      // Convert map to array
      Object.keys(teamMap).forEach(index => {
        const member = teamMap[index];
        if (member.name || member.designation) {
          team.push(member);
        }
      });
      
      if (team.length > 0) {
        parsed.team = team;
      }
    }
    
    // Parse specializations array (for developers)
    if (parsed.specializations) {
      const specializations = [];
      const specMap = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('specializations[') && key.includes(']')) {
          const match = key.match(/specializations\[(\d+)\]\[(\w+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!specMap[index]) {
              specMap[index] = {};
            }
            specMap[index][field] = parsed[key];
            delete parsed[key];
          }
        }
      });
      
      // Convert map to array
      Object.keys(specMap).forEach(index => {
        const spec = specMap[index];
        if (spec.name || spec.description) {
          specializations.push(spec);
        }
      });
      
      if (specializations.length > 0) {
        parsed.specializations = specializations;
      }
    }
    
    // Parse awards array (for developers)
    if (parsed.awards) {
      const awards = [];
      const awardMap = {};
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('awards[') && key.includes(']')) {
          const match = key.match(/awards\[(\d+)\]\[(\w+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!awardMap[index]) {
              awardMap[index] = {};
            }
            awardMap[index][field] = parsed[key];
            delete parsed[key];
          }
        }
      });
      
      // Convert map to array
      Object.keys(awardMap).forEach(index => {
        const award = awardMap[index];
        if (award.name || award.category) {
          awards.push(award);
        }
      });
      
      if (awards.length > 0) {
        parsed.awards = awards;
      }
    }
    
    return parsed;
  };
  
  const parsedBody = parseNestedFields(req.body);
  console.log('🔧 Parsed req.body:', JSON.stringify(parsedBody, null, 2));
  
  req.body = parsedBody;
  next();
};

module.exports = parseFormData;
