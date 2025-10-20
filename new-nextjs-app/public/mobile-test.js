// Mobile Responsiveness Test Script
// This script tests the mobile responsiveness improvements

const testMobileResponsiveness = () => {
  console.log('🧪 Testing Mobile Responsiveness...');
  
  // Test 1: Check if z-index CSS variables are loaded
  const zIndexStyles = getComputedStyle(document.documentElement);
  const zIndexValues = {
    '--z-header': zIndexStyles.getPropertyValue('--z-header'),
    '--z-mobile-menu': zIndexStyles.getPropertyValue('--z-mobile-menu'),
    '--z-sticky-filters': zIndexStyles.getPropertyValue('--z-sticky-filters'),
    '--z-drawer': zIndexStyles.getPropertyValue('--z-drawer'),
    '--z-dropdown': zIndexStyles.getPropertyValue('--z-dropdown')
  };
  
  console.log('✅ Z-Index Values:', zIndexValues);
  
  // Test 2: Check mobile menu button
  const mobileMenuButton = document.querySelector('.menu-button');
  if (mobileMenuButton) {
    const buttonStyles = getComputedStyle(mobileMenuButton);
    console.log('✅ Mobile Menu Button:', {
      minWidth: buttonStyles.minWidth,
      minHeight: buttonStyles.minHeight,
      zIndex: buttonStyles.zIndex
    });
  }
  
  // Test 3: Check mobile menu backdrop
  const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
  if (mobileMenuBackdrop) {
    const backdropStyles = getComputedStyle(mobileMenuBackdrop);
    console.log('✅ Mobile Menu Backdrop:', {
      zIndex: backdropStyles.zIndex,
      position: backdropStyles.position
    });
  }
  
  // Test 4: Check mobile menu
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu) {
    const menuStyles = getComputedStyle(mobileMenu);
    console.log('✅ Mobile Menu:', {
      zIndex: menuStyles.zIndex,
      position: menuStyles.position
    });
  }
  
  // Test 5: Check touch targets
  const buttons = document.querySelectorAll('button, [role="button"], a');
  const smallButtons = Array.from(buttons).filter(button => {
    const styles = getComputedStyle(button);
    const width = parseInt(styles.width) || 0;
    const height = parseInt(styles.height) || 0;
    return width < 44 || height < 44;
  });
  
  if (smallButtons.length === 0) {
    console.log('✅ All buttons have proper touch targets (44px minimum)');
  } else {
    console.log('⚠️ Found buttons with small touch targets:', smallButtons.length);
  }
  
  // Test 6: Check for horizontal overflow
  const body = document.body;
  const bodyStyles = getComputedStyle(body);
  console.log('✅ Body overflow-x:', bodyStyles.overflowX);
  
  console.log('🎉 Mobile Responsiveness Test Complete!');
};

// Run test when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testMobileResponsiveness);
} else {
  testMobileResponsiveness();
}

// Export for manual testing
window.testMobileResponsiveness = testMobileResponsiveness;
