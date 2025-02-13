const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <h5 className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
        <p className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
          ©{1900 + new Date().getYear()}  
          {/* Blitz Learning Technologies Pvt. Ltd., 2024. All rights reserved. */}
        </p>
      </h5>
      <div>
        {/* <ul className="flex flex-wrap items-center sm:flex-nowrap ">
        <li className="mr-6">
        <a
            target="blank"
            href="https://www.blitzlearning.in/about-us"
            className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base"
          >
            About us
          </a>
        </li>
        <li className="mr-6">
          <a
            target="blank"
            href="https://www.blitzlearning.in/service"
            className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base"
          >
            Services
          </a>
        </li>
        <li className="mr-6">
          <a
            target="blank"
            href="https://www.blitzlearning.in/privacy-policy"
            className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base"
          >
            Privacy Policy
          </a>
        </li>
        <li className="mr-6">
          <a
            target="blank"
            href="https://www.blitzlearning.in/blog/"
            className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base"
          >
            Blog
          </a>
        </li>
        </ul> */}
      </div>
    </div>
  );
};

export default Footer;
