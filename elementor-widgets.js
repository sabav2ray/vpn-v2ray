(function ($, elementor) {
  "use strict";

  var WdesWidgets = {
    init: function () {
      var elements = {
        "wdes_testimonials.default": WdesWidgets.elementTestimonials,
        "wdes_table.default": WdesWidgets.elementTable,
        "wdes_world_map.default": WdesWidgets.elementWorldMap,
        "wdes-forms-widget.default": WdesWidgets.elementDomainSearch,
        "wdes_countdown_timer.default": WdesWidgets.elementorCountDown,
        "wdes-nav-menu.default": WdesWidgets.elementorNavMenu,
        "wdes-site-woo-cart.default": WdesWidgets.elementorCart,
        "wdes_map.default": WdesWidgets.elementorMap,
        "wdes_portfolio.default": WdesWidgets.elementorPortfolio,
        "wdes_range_slider.default": WdesWidgets.elementorRangeSlider,
        "wdes_progress.default": WdesWidgets.elementorProgress,
      };

      $(document).on(
        "click.WdesWidgets",
        ".wdes-search-popup-trigger, .wdes-search-popup-close",
        WdesWidgets.elementSearchPopup
      );

      $.each(elements, function (element, callback) {
        elementor.hooks.addAction(
          "frontend/element_ready/" + element,
          callback
        );
      });
    },

    elementTestimonials: function ($scope) {
      var target = $scope.find(".wdes-testimonials-instance"),
        settings = target.data("settings"),
        navSpeed = settings.autoplaySpeed,
        tableItems,
        mobileItems,
        desktopItems,
        owlOptions;

      if (settings.items.mobile) {
        mobileItems = settings.items.mobile;
      } else {
        mobileItems = 1;
      }

      if (settings.items.tablet) {
        tableItems = settings.items.tablet;
      } else {
        tableItems = 1 === settings.items.desktop ? 1 : 2;
      }

      if (settings.items.desktop) {
        desktopItems = settings.items.desktop;
      }

      settings.items = settings.items.desktop;

      var defaultOptions = {
        navSpeed: navSpeed,
        dotsSpeed: navSpeed,
        responsive: {
          0: {
            items: mobileItems,
          },
          768: {
            items: tableItems,
          },
          1025: {
            items: desktopItems,
          },
        },
      };

      owlOptions = $.extend({}, defaultOptions, settings);

      target.owlCarousel(owlOptions);
    },
    elementTable: function ($scope) {
      var $target = $scope.find(".wdes-table"),
        options = {
          cssHeader: "wdes-table-header-sort",
          cssAsc: "wdes-table-header-sort-up",
          cssDesc: "wdes-table-header-sort-down",
        };
      if (!$target.length) {
        return;
      }

      if ($scope.find(".wdes-table-search").length === 1) {
        options["widgets"] = ["zebra", "filter"];
        options["widgetOptions"] = { filter_columnFilters: false };
      }

      if ($target.hasClass("wdes-table-sorting")) {
        var $table = $target.tablesorter(options);
        $.tablesorter.filter.bindSearch(
          $table,
          $scope.find(".wdes-table-search")
        );
      }
    },

    elementWorldMap: function ($scope) {
      var setting = $scope.find("#wdes-world-map").data("settings"),
        data = $scope.find("#wdes-world-map").data("countries"),
        lats = data.map(function (zone) {
          return zone.latitude;
        }),
        long = data.map(function (zone) {
          return zone.longitude;
        }),
        targetSVG =
          "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z",
        planeSVG =
          "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
        addTarget = data.map((zone) => {
          zone.svgPath = targetSVG;
          return zone;
        }),
        planShadowStyle = {
          svgPath: planeSVG,
          positionOnLine: 0,
          color: setting.movingObject.shadowColor,
          alpha: 0.1,
          animateAlongLine: true,
          lineId: "line2",
          flipDirection: true,
          loop: true,
          scale: 0.03,
          positionScale: 1.3,
        },
        planStyle = {
          svgPath: planeSVG,
          positionOnLine: 0,
          color: setting.movingObject.color,
          animateAlongLine: true,
          lineId: "line1",
          flipDirection: true,
          loop: true,
          scale: 0.03,
          positionScale: 1.8,
        },
        zoomLevel =
          setting.settings.home.zoom != null ? setting.settings.home.zoom : 1,
        zoomLongitude =
          setting.settings.home.longitude != null
            ? setting.settings.home.longitude
            : 11.4953,
        zoomLatitude =
          setting.settings.home.latitude != null
            ? setting.settings.home.latitude
            : 13.5341;
      addTarget.push(planShadowStyle, planStyle);

      AmCharts.makeChart("chartdiv", {
        type: "map",
        theme: "light",

        projection: "winkel3",
        dataProvider: {
          map: "worldLow",
          zoomLevel: zoomLevel,
          zoomLongitude: zoomLongitude,
          zoomLatitude: zoomLatitude,
          lines: [
            // Active Lines
            {
              id: "line1",
              arc: -0.85,
              alpha: 0.3,
              latitudes: lats,
              longitudes: long,
            },
            // Lines Shadow
            {
              id: "line2",
              alpha: 0,
              color: "#000000",
              latitudes: lats,
              longitudes: long,
            },
          ],
          // Locations
          images: addTarget,
        },

        // Maps Background
        areasSettings: {
          unlistedAreasColor: setting.areasSettings.unlistedAreasColor,
          unlistedAreasOutlineColor:
            setting.areasSettings.unlistedAreasOutlineColor,
        },

        // Location Style
        imagesSettings: {
          color: setting.imagesSettings.color, // Spot Color
          rollOverColor: setting.imagesSettings.rollOverColor, // Spot Hover Color
          selectedColor: "#ffffff", // Box Color
          pauseDuration: 0.2,
          animationDuration: 4,
          adjustAnimationSpeed: true,
        },

        // Lines
        linesSettings: {
          color: setting.line.linesSettings,
          alpha: 0.4,
        },

        export: {
          enabled: true,
        },
      });
    },
    elementDomainSearch: function ($scope, $) {
      var DomainCheck = {
        submit: function (e) {
          e.preventDefault();
          var obj = e.data,
            el = obj.wap.find("#wdes-domain-results"),
            domainDefault = "whmcsdes.com",
            inputDomain =
              psl.parse(obj.input.val()).domain === null
                ? obj.input.val() + ".com"
                : obj.input.val(),
            parsed = psl.parse(inputDomain),
            basename = obj.input.val() !== "" ? parsed.domain : domainDefault;

          obj.security = obj.form.find("input[name=security]").val();

          //check if domain is valid
          var dcErrorMess = $scope.find("#dc-error-message-invalid"),
            dcErrorUnsupportedMess = $scope.find(
              "#dc-error-message-unsupported"
            ),
            filterlocaltlds =
              obj.localTlds != null
                ? obj.localTlds.filter(function (value) {
                    return value === parsed.tld;
                  })
                : [parsed.tld];
          obj.el = el;

          if (psl.isValid(inputDomain) && filterlocaltlds.length > 0) {
            //check if error is display
            if (dcErrorMess.hasClass("d-block")) {
              dcErrorMess.removeClass("d-block").addClass("d-none");
            }
            if (dcErrorUnsupportedMess.hasClass("d-block")) {
              dcErrorUnsupportedMess.removeClass("d-block").addClass("d-none");
            }

            //start search on domain
            var domainData = {},
              spinnerIcon =
                obj.setting.spinnerIcon.length > 0
                  ? obj.setting.spinnerIcon
                  : "",
              domainResultTable = $(
                '<div id="wdes_result_item" class="wdes-result-domain-box" role="alert"> </div>'
              ),
              domainResult = $(
                '<div class="inner-block-result-item">' +
                  '<div class="spinner wdes-loading-results">' +
                  '<i class="' +
                  spinnerIcon +
                  ' fa-spin fa-lg fa-fw"></i>' +
                  '<span class="sr-only">...</span>' +
                  "</div>" +
                  "</div>"
              );

            $.extend(domainData, obj);
            domainData.domain = basename.replace(/<[^>]*>?/gm, "");
            domainData.el = domainResult;
            domainData.parsed = parsed;
            domainData.submit = obj.submit;
            domainData.lupid = e.data.LUPId;

            domainResult.data("domain", domainData.domain);

            if (obj.el.find("#wdes_result_item").length < 0) {
              obj.el.append(domainResultTable);
              obj.el.find("#wdes_result_item").append(domainResult);
            } else {
              obj.el.find("#wdes_result_item").remove();
              obj.el.append(domainResultTable);
              obj.el.find("#wdes_result_item").append(domainResult);
            }
            obj.el
              .find("#wdes_result_item")
              .append(
                '<span class="results-wdes-dom">' +
                  domainData.domain +
                  "</span>"
              );

            if (domainData.form.find("#wdes-dc-more-options ul").length > 0) {
              domainData.form.find("#wdes-dc-more-options ul").remove();
              domainData.form.find("#wdes-dc-more-options").addClass("d-none");
            }

            DomainCheck.checkAjax(domainData);
          } else {
            if (obj.el.find("#wdes_result_item").length > 0) {
              obj.el.find("#wdes_result_item").remove();
            }

            if (obj.form.find("#wdes-dc-more-options ul").length > 0) {
              obj.form.find("#wdes-dc-more-options ul").remove();
              obj.form.find("#wdes-dc-more-options").addClass("d-none");
            }

            if (!psl.isValid(inputDomain)) {
              if (!dcErrorMess.hasClass("d-block")) {
                dcErrorMess.removeClass("d-none").addClass("d-block");
              }
            } else {
              if (!dcErrorUnsupportedMess.hasClass("d-block")) {
                dcErrorUnsupportedMess
                  .removeClass("d-none")
                  .addClass("d-block");
              }
            }
          }
        },

        name: function (domain) {
          return domain.replace(/^.*\/|\.[^.]*$/g, "");
        },

        getPriorityTlds: function (tldLists, tldThatused) {
          if (tldLists.length > 0) {
            var tlds = tldLists.reduce(function (results, t) {
              t.tld = t.tld.replace("domain-", "").replace("-", ".");
              if (tldThatused !== t.tld) {
                results.push(t);
              }
              return results;
            }, []);
            return tlds;
          } else {
            return [];
          }
        },
        checkAjax: function (obj) {
          var data = {
            domain: obj.domain,
            action: "wdes_ajax_search_domain",
            security: obj.security,
            settings: obj.form.data("setting"),
            lupid: obj.lupid,
          };
          obj.submit.attr("disabled", true);
          $.ajax({
            url: wdes_ajax_url,
            type: "POST",
            dataType: "json",
            data: data,
            success: function (data) {
              obj.el.find(".spinner").remove();
              obj.form.find(".results-wdes-dom").html(data.message);
              obj.el.append(data.results_html);
              //transfer
              jQuery("#wdesDomainTransferBtn").on("click", function () {
                let whmcsDomainFromAction = $scope.find("#wdes-domain-form");
                if (whmcsDomainFromAction !== undefined) {
                  let whmcsDomain = whmcsDomainFromAction
                    .attr("action")
                    .split("/domainchecker.php")[0];
                  window.open(
                    whmcsDomain +
                      "/cart.php?a=add&domain=transfer&query=" +
                      data.domain,
                    "_blank"
                  );
                }
              });

              //whois
              jQuery("#wdesDomainWhoisBtn").on("click", function () {
                let data = {
                  domain: obj.domain,
                  action: "wdes_domain_whois",
                  security: obj.form.find("input[name=security-whois]").val(),
                };
                $.ajax({
                  url: wdes_ajax_url,
                  type: "POST",
                  dataType: "json",
                  data: data,
                  success: function (data) {
                    obj.form
                      .find("#wdesDomainWhois #wdesDomainWhois-content pre")
                      .remove();
                    obj.form
                      .find("#wdesDomainWhois #wdesDomainWhois-content")
                      .append("<pre>" + data.whois + "</pre>");
                    MicroModal.show("wdesDomainWhois", {
                      onClose: (modal, button, event) => event.preventDefault(), // [2]
                    });
                  },
                });
              });
            },
            complete: function () {
              var tldsObject = DomainCheck.getPriorityTlds(
                  obj.tlds,
                  obj.parsed.tld
                ),
                tlds = tldsObject.reduce(function (ts, t) {
                  ts.push(t.tld);
                  return ts;
                }, []);
              if (0 === tlds.length) return false;
              var resultDev = obj.form.find("#wdes-domain-results"),
                moreOptionDiv = obj.form.find("#wdes-dc-more-options");
              if (resultDev.length) {
                let data = {
                  domain: obj.domain,
                  sld: obj.parsed.sld,
                  tlds: tlds,
                  action: "wdes_ajax_search_domain_m",
                  security: obj.security,
                  lupid: obj.lupid,
                };
                if (moreOptionDiv.find("ul").length > 0) {
                  moreOptionDiv.find("ul").remove();
                }

                //spinner icon
                var suggestionSpinnerIcon =
                  obj.setting.suggestionsSpinnerIcon.length > 0
                    ? obj.setting.suggestionsSpinnerIcon
                    : "";

                moreOptionDiv.append(
                  '<div class="spinner wdes-loading-results"><i class="' +
                    suggestionSpinnerIcon +
                    ' fa-spin fa-lg fa-fw"></i><span class="sr-only">...</span></div>'
                );
                moreOptionDiv.removeClass("d-none");
                $.ajax({
                  url: wdes_ajax_url,
                  type: "POST",
                  dataType: "json",
                  data: data,
                  success: function (res) {
                    if (res.result === "success") {
                      let moreOptionsContent = "";
                      for (let i = 0; i < tlds.length; i++) {
                        if (
                          res.data[tlds[i]] !== undefined &&
                          res.data[tlds[i]].status === "available"
                        ) {
                          moreOptionsContent += "<li>";
                          moreOptionsContent +=
                            "<h5>" + res.data[tlds[i]].message + "</h5>";
                          moreOptionsContent +=
                            "<span>" + tldsObject[i].price + "</span>";
                          moreOptionsContent +=
                            "<div>" + res.data[tlds[i]].results_html + "</div>";
                          moreOptionsContent += "</li>";
                        }
                      }
                      if (moreOptionsContent.length === 0) {
                        moreOptionDiv.find("ul").remove();
                        moreOptionDiv.addClass("d-none");
                        moreOptionDiv.find(".spinner").remove();
                      } else {
                        moreOptionDiv.find(".spinner").remove();
                        moreOptionDiv.append(
                          "<ul>" + moreOptionsContent + "</ul>"
                        );
                      }
                    }
                  },
                  complete: function () {
                    obj.submit.attr("disabled", false);
                  },
                });
              } else {
                obj.submit.attr("disabled", false);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              console.log(xhr);
              console.log(thrownError);
            },
          });
        },
      };

      $scope.find("#wdes-domain-search").is(function () {
        var id = $(this),
          submitEl = id.find("#wdes-search"),
          inputEl = id.find("#wdes-domain"),
          formEl = id.find("#wdes-domain-form"),
          tldsEl = id.find(".extensions-block"),
          settingEl = formEl.data("setting"),
          priorityTlds = $scope
            .find("#preloader-resource")
            .data("priorityTlds"),
          priorityLocalTlds = $scope
            .find("#preloader-resource")
            .data("priorityLocalTlds"),
          LUPId = $scope.find("#wdes_lup").val(),
          data;
        data = {
          submit: submitEl,
          input: inputEl,
          form: formEl,
          div: id,
          wap: id,
          LUPId,
          tlds: priorityTlds,
          setting: settingEl,
          localTlds: priorityLocalTlds.length > 0 ? priorityLocalTlds : null,
        };

        if (!$scope.find("#security").length) {
          $.ajax({
            url: wdes_ajax_url,
            type: "GET",
            dataType: "json",
            data: { action: "wdes_domain_security" },
            success: function (res) {
              if (res.domainSecurityNonce.length > 0) {
                $scope.find("#wdes-search").before(res.domainSecurityNonce);
              }
            },
          });
        }

        if (inputEl.val().length <= 0) {
          submitEl.attr("disabled", true);
        }

        inputEl.keyup(function () {
          if ($(this).val().length != 0) submitEl.attr("disabled", false);
          else submitEl.attr("disabled", true);
        });

        tldsEl.find("a").on("click", function (e) {
          e.preventDefault();
          let tldName = $(this).find(".domain-ext-name").text(),
            isAllowedExt = priorityTlds.filter(function (item) {
              return (
                item.tld === tldName.replace(".", "domain-") ||
                item.tld === tldName.replace(".", "")
              );
            });
          if (isAllowedExt.length > 0) {
            let inputVal = inputEl.val(),
              parseInput = psl.parse(inputVal);
            if (inputVal.length > 0) {
              if (parseInput.sld !== null) {
                inputEl.val(parseInput.sld + tldName);
              } else {
                inputEl.val(inputVal + tldName);
              }
            }
          }
        });

        if ($scope.find(".extensions-block").children("a").length == 0) {
          $scope.find(".extensions-block").remove();
        }
        submitEl.on("click", data, DomainCheck.submit);
        formEl.on("click", ".wdes-purchase-btn", function (e) {
          $(this)
            .parent()
            .find('input[name="select-domain"]')
            .attr("name", "domain");
        });
      });
    },
    elementorCountDown: function ($scope, $) {
      let countdownTimeMain = $scope.find(".wdes-countdown-timer"),
        configs = countdownTimeMain.data("configs"),
        generalClass = "wdes-countdown-timer_item",
        valueClass = generalClass + "-value",
        labelClass = generalClass + "-label";

      var addStyleToDigit = function (n) {
          let nString = n.toString(),
            className = "wdes-countdown-timer_digit";
          if (nString.length <= 1) {
            return Array.from(n.toString()).map(function (Number) {
              return (
                '<div class="' +
                className +
                '">0</div><div class="' +
                className +
                '">' +
                Number +
                "</div>"
              );
            });
          } else {
            return Array.from(n.toString()).map(function (Number) {
              return '<div class="' + className + '">' + Number + "</div>";
            });
          }
        },
        separatorValue = function (seetingsObj) {
          var output = "";

          if (seetingsObj.display === "yes") {
            switch (seetingsObj.type) {
              case "solid":
                output = "|";
                break;
              case "dotted":
                output = ":";
                break;
              case "custom":
                output = seetingsObj.custom;
            }
          }

          return output;
        };

      countdownTimeMain
        .countdown(configs.date)
        .on("update.countdown", function (event) {
          var format = "",
            separator =
              '<div class="wdes-countdown-timer_separator">' +
              separatorValue(configs.separator) +
              "</div>";

          //days
          if (configs.display.days.length > 0) {
            var labelDays =
              configs.label.days.length > 0
                ? '<div class="' +
                  labelClass +
                  '">' +
                  configs.label.days +
                  "</div>"
                : "";
            format =
              '<div class="' +
              generalClass +
              ' item-days"> <div class="' +
              valueClass +
              '">' +
              addStyleToDigit(event.offset.totalDays).join("") +
              "</div> " +
              labelDays +
              "</div>" +
              separator;
          }

          //hours
          if (configs.display.hours.length > 0) {
            var labelHours =
              configs.label.hours.length > 0
                ? '<div class="' +
                  labelClass +
                  '">' +
                  configs.label.hours +
                  "</div>"
                : "";
            format +=
              '<div class="' +
              generalClass +
              ' item-hours"><div class="' +
              valueClass +
              '">' +
              addStyleToDigit(event.offset.hours).join("") +
              "</div> " +
              labelHours +
              "</div>" +
              separator;
          }

          //minutes
          if (configs.display.min.length > 0) {
            var labelMin =
              configs.label.min.length > 0
                ? '<div class="' +
                  labelClass +
                  '">' +
                  configs.label.min +
                  "</div>"
                : "";
            format +=
              '<div class="' +
              generalClass +
              ' item-minutes"><div class="' +
              valueClass +
              '">' +
              addStyleToDigit(event.offset.minutes).join("") +
              "</div> " +
              labelMin +
              "</div>" +
              separator;
          }

          //seconds
          if (configs.display.sec.length > 0) {
            var labelSec =
              configs.label.sec.length > 0
                ? '<div class="' +
                  labelClass +
                  '">' +
                  configs.label.sec +
                  "</div>"
                : "";
            format +=
              '<div class="' +
              generalClass +
              ' item-seconds"><div class="' +
              valueClass +
              '">' +
              addStyleToDigit(event.offset.seconds).join("") +
              "</div> " +
              labelSec +
              "</div>";
          }

          $(this).html(event.strftime(format));
        })
        .on("finish.countdown", function (event) {
          var format = "",
            separator =
              '<div class="wdes-countdown-timer_separator">' +
              separatorValue(configs.separator) +
              "</div>";

          if (configs.finish.action === "redirect") {
            if (
              configs.finish.redirectUrl &&
              !elementor.config.environmentMode.edit
            ) {
              window.location.href = configs.finish.redirectUrl;
            }
          } else if (configs.finish.action === "message") {
            format =
              '<div class="wdes-countdown-timer-message">' +
              configs.finish.message +
              "</div>";
          } else if (configs.finish.action === "template") {
            $scope.find(".wdes-countdown-timer-template").show();
            $scope.find(".wdes-countdown-timer").hide();
          } else if (configs.finish.action === "hide") {
            format = "";
          } else {
            //days
            if (configs.label.days.length > 0) {
              format =
                '<div class="' +
                generalClass +
                ' item-days"> <div class="' +
                valueClass +
                '">%D</div> <div class="' +
                labelClass +
                '">' +
                configs.label.days +
                "</div></div>" +
                separator;
            }

            //hours
            if (configs.label.hours.length > 0) {
              format +=
                '<div class="' +
                generalClass +
                ' item-hours"><div class="' +
                valueClass +
                '">%I</div> <div class="' +
                labelClass +
                '">' +
                configs.label.hours +
                "</div></div>" +
                separator;
            }

            //minutes
            if (configs.label.min.length > 0) {
              format +=
                '<div class="' +
                generalClass +
                ' item-minutes"><div class="' +
                valueClass +
                '">%N</div> <div class="' +
                labelClass +
                '">' +
                configs.label.min +
                "</div></div>" +
                separator;
            }

            //seconds
            if (configs.label.sec.length > 0) {
              format +=
                '<div class="' +
                generalClass +
                ' item-seconds"><div class="' +
                valueClass +
                '">%T</div> <div class="' +
                labelClass +
                '">' +
                configs.label.sec +
                "</div></div>";
            }
          }

          $(this).html(event.strftime(format));
        });
    },
    elementorNavMenu: function ($scope) {
      if ($scope.data("initialized")) {
        return;
      }

      $scope.data("initialized", true);

      var hoverClass = "wdes-nav-hover",
        hoverOutClass = "wdes-nav-hover-out",
        mobileActiveClass = "wdes-mobile-menu-active";

      $scope
        .find(".wdes-nav-wrap .wdes-nav .menu-item-has-children")
        .on("mouseenter mouseleave", function (e) {
          if ($scope.find(this).children("ul").length) {
            const dropdownMenu = $scope.find(this).children("ul:first");
            const offset = dropdownMenu.offset();

            const isEntirelyVisible =
              offset.left + dropdownMenu.width() <= $("#Top_bar").width();

            if (!isEntirelyVisible) {
              $scope.find(this).addClass("right-position");
            } else {
              setTimeout(function () {
                $scope.find(this).removeClass("right-position");
              }, 210);
            }
          }
        });

      $scope.find(".wdes-nav:not(.wdes-nav-vertical-sub-bottom)").hoverIntent({
        over: function () {
          $(this).addClass(hoverClass);
        },
        out: function () {
          var $this = $(this);
          $this.removeClass(hoverClass);
          $this.addClass(hoverOutClass);
          setTimeout(function () {
            $this.removeClass(hoverOutClass);
          }, 200);
        },
        timeout: 200,
        selector: ".menu-item-has-children",
      });

      if (WdesWidgets.mobileAndTabletCheck()) {
        $scope
          .find(".wdes-nav:not(.wdes-nav-vertical-sub-bottom)")
          .on("touchstart.wdesNavMenu", ".menu-item > a", touchStartItem);
        $scope
          .find(".wdes-nav:not(.wdes-nav-vertical-sub-bottom)")
          .on("touchend.wdesNavMenu", ".menu-item > a", touchEndItem);

        $(document).on("touchstart.wdesNavMenu", prepareHideSubMenus);
        $(document).on("touchend.wdesNavMenu", hideSubMenus);
      } else {
        $scope
          .find(".wdes-nav:not(.wdes-nav-vertical-sub-bottom)")
          .on("click.wdesNavMenu", ".menu-item > a", clickItem);
      }

      if (!WdesWidgets.isEditMode()) {
        initMenuAnchorsHandler();
      }

      function touchStartItem(event) {
        var $currentTarget = $(event.currentTarget),
          $this = $currentTarget.closest(".menu-item");

        $this.data("offset", $(window).scrollTop());
        $this.data("elemOffset", $this.offset().top);
      }

      function touchEndItem(event) {
        var $this,
          $siblingsItems,
          $link,
          $currentTarget,
          subMenu,
          offset,
          elemOffset,
          $hamburgerPanel;

        event.preventDefault();

        $currentTarget = $(event.currentTarget);
        $this = $currentTarget.closest(".menu-item");
        $siblingsItems = $this.siblings(".menu-item.menu-item-has-children");
        $link = $("> a", $this);
        subMenu = $(".wdes-nav-sub:first", $this);
        offset = $this.data("offset");
        elemOffset = $this.data("elemOffset");
        $hamburgerPanel = $this.closest(".wdes-hamburger-panel");

        if (
          offset !== $(window).scrollTop() ||
          elemOffset !== $this.offset().top
        ) {
          return false;
        }

        if ($siblingsItems[0]) {
          $siblingsItems.removeClass(hoverClass);
          $(".menu-item-has-children", $siblingsItems).removeClass(hoverClass);
        }

        if (!$(".wdes-nav-sub", $this)[0] || $this.hasClass(hoverClass)) {
          $link.trigger("click"); // Need for a smooth scroll when clicking on an anchor link
          window.location.href = $link.attr("href");

          if ($scope.find(".wdes-nav-wrap").hasClass(mobileActiveClass)) {
            $scope.find(".wdes-nav-wrap").removeClass(mobileActiveClass);
          }

          if ($hamburgerPanel[0] && $hamburgerPanel.hasClass("open-state")) {
            $hamburgerPanel.removeClass("open-state");
            $("html").removeClass("wdes-hamburger-panel-visible");
          }

          return false;
        }

        if (subMenu[0]) {
          $this.addClass(hoverClass);
        }
      }

      function clickItem(event) {
        var $currentTarget = $(event.currentTarget),
          $menuItem = $currentTarget.closest(".menu-item"),
          $hamburgerPanel = $menuItem.closest(".wdes-hamburger-panel");

        if (
          !$menuItem.hasClass("menu-item-has-children") ||
          $menuItem.hasClass(hoverClass)
        ) {
          if ($hamburgerPanel[0] && $hamburgerPanel.hasClass("open-state")) {
            $hamburgerPanel.removeClass("open-state");
            $("html").removeClass("wdes-hamburger-panel-visible");
          }
        }
      }

      var scrollOffset;

      function prepareHideSubMenus(event) {
        scrollOffset = $(window).scrollTop();
      }

      function hideSubMenus(event) {
        var $menu = $scope.find(".wdes-nav");

        if (
          "touchend" === event.type &&
          scrollOffset !== $(window).scrollTop()
        ) {
          return;
        }

        if ($(event.target).closest($menu).length) {
          return;
        }

        var $openMenuItems = $(".menu-item-has-children." + hoverClass, $menu);

        if (!$openMenuItems[0]) {
          return;
        }

        $openMenuItems.removeClass(hoverClass);
        $openMenuItems.addClass(hoverOutClass);

        setTimeout(function () {
          $openMenuItems.removeClass(hoverOutClass);
        }, 200);

        if ($menu.hasClass("wdes-nav-vertical-sub-bottom")) {
          $(".wdes-nav-sub", $openMenuItems).slideUp(200);
        }

        event.stopPropagation();
      }

      // START Vertical Layout: Sub-menu at the bottom
      $scope
        .find(".wdes-nav-vertical-sub-bottom")
        .on("click.wdesNavMenu", ".menu-item > a", verticalSubBottomHandler);

      function verticalSubBottomHandler(event) {
        var $currentTarget = $(event.currentTarget),
          $menuItem = $currentTarget.closest(".menu-item"),
          $siblingsItems = $menuItem.siblings(
            ".menu-item.menu-item-has-children"
          ),
          $subMenu = $(".wdes-nav-sub:first", $menuItem),
          $hamburgerPanel = $menuItem.closest(".wdes-hamburger-panel");

        if (
          !$menuItem.hasClass("menu-item-has-children") ||
          $menuItem.hasClass(hoverClass)
        ) {
          if ($scope.find(".wdes-nav-wrap").hasClass(mobileActiveClass)) {
            $scope.find(".wdes-nav-wrap").removeClass(mobileActiveClass);
          }

          if ($hamburgerPanel[0] && $hamburgerPanel.hasClass("open-state")) {
            $hamburgerPanel.removeClass("open-state");
            $("html").removeClass("wdes-hamburger-panel-visible");
          }

          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if ($siblingsItems[0]) {
          $siblingsItems.removeClass(hoverClass);
          $(".menu-item-has-children", $siblingsItems).removeClass(hoverClass);
          $(".wdes-nav-sub", $siblingsItems).slideUp(200);
        }

        if ($subMenu[0]) {
          $subMenu.slideDown(200);
          $menuItem.addClass(hoverClass);
        }
      }

      $(document).on("click.wdesNavMenu", hideVerticalSubBottomMenus);

      function hideVerticalSubBottomMenus(event) {
        if (
          !$scope.find(".wdes-nav").hasClass("wdes-nav-vertical-sub-bottom")
        ) {
          return;
        }

        hideSubMenus(event);
      }
      // END Vertical Layout: Sub-menu at the bottom

      // Mobile trigger click event
      $(".wdes-nav-mobile-trigger", $scope).on(
        "click.wdesNavMenu",
        function (event) {
          $(this).closest(".wdes-nav-wrap").toggleClass(mobileActiveClass);
        }
      );

      // START Mobile Layout: Left-side, Right-side
      if ("ontouchend" in window) {
        $(document).on("touchend.wdesMobileNavMenu", removeMobileActiveClass);
      } else {
        $(document).on("click.wdesMobileNavMenu", removeMobileActiveClass);
      }

      function removeMobileActiveClass(event) {
        var mobileLayout = $scope.find(".wdes-nav-wrap").data("mobile-layout"),
          $navWrap = $scope.find(".wdes-nav-wrap"),
          $trigger = $scope.find(".wdes-nav-mobile-trigger"),
          $menu = $scope.find(".wdes-nav");

        if ("left-side" !== mobileLayout && "right-side" !== mobileLayout) {
          return;
        }

        if (
          "touchend" === event.type &&
          scrollOffset !== $(window).scrollTop()
        ) {
          return;
        }

        if (
          $(event.target).closest($trigger).length ||
          $(event.target).closest($menu).length
        ) {
          return;
        }

        if (!$navWrap.hasClass(mobileActiveClass)) {
          return;
        }

        $navWrap.removeClass(mobileActiveClass);

        event.stopPropagation();
      }

      $(".wdes-nav-mobile-close-btn", $scope).on(
        "click.wdesMobileNavMenu",
        function (event) {
          $(this).closest(".wdes-nav-wrap").removeClass(mobileActiveClass);
        }
      );

      // END Mobile Layout: Left-side, Right-side

      // START Mobile Layout: Full-width
      var initMobileFullWidthCss = false;

      setFullWidthMenuPosition();
      $(window).on("resize.wdesMobileNavMenu", setFullWidthMenuPosition);

      function setFullWidthMenuPosition() {
        var mobileLayout = $scope.find(".wdes-nav-wrap").data("mobile-layout");

        if ("full-width" !== mobileLayout) {
          return;
        }

        var $menu = $scope.find(".wdes-nav"),
          currentDeviceMode = elementorFrontend.getCurrentDeviceMode();

        if ("mobile" !== currentDeviceMode) {
          if (initMobileFullWidthCss) {
            $menu.css({ left: "" });
            initMobileFullWidthCss = false;
          }
          return;
        }

        if (initMobileFullWidthCss) {
          $menu.css({ left: "" });
        }

        var offset = -$menu.offset().left;

        $menu.css({ left: offset });
        initMobileFullWidthCss = true;
      }
      // END Mobile Layout: Full-width

      // Menu Anchors Handler
      function initMenuAnchorsHandler() {
        var $anchorLinks = $scope.find('.menu-item-link[href*="#"]');

        if ($anchorLinks[0]) {
          $anchorLinks.each(function () {
            if ("" !== this.hash && location.pathname === this.pathname) {
              menuAnchorHandler($(this));
            }
          });
        }
      }

      function menuAnchorHandler($anchorLink) {
        var anchorHash = $anchorLink[0].hash,
          activeClass = "current-menu-item",
          rootMargin = "-50% 0% -50%",
          $anchor;

        try {
          $anchor = $(decodeURIComponent(anchorHash));
        } catch (e) {
          return;
        }

        if (!$anchor[0]) {
          return;
        }

        if ($anchor.hasClass("elementor-menu-anchor")) {
          rootMargin = "300px 0% -300px";
        }

        var observer = new IntersectionObserver(
          function (entries) {
            if (entries[0].isIntersecting) {
              $anchorLink.parent(".menu-item").addClass(activeClass);
            } else {
              $anchorLink.parent(".menu-item").removeClass(activeClass);
            }
          },
          {
            rootMargin: rootMargin,
          }
        );

        observer.observe($anchor[0]);
      }

      if (WdesWidgets.isEditMode()) {
        $scope.data("initialized", false);
      }
    },
    elementSearchPopup: function (e) {
      var $this = $(this),
        $widget = $this.closest(".wdes-search"),
        $input = $(".wdes-search-field", $widget),
        activeClass = "wdes-search-popup-active",
        transitionIn = "wdes-transition-in",
        transitionOut = "wdes-transition-out";
      console.log($widget);
      if (!$widget.hasClass(activeClass)) {
        $widget.addClass(transitionIn);
        setTimeout(function () {
          $widget.removeClass(transitionIn);
          $widget.addClass(activeClass);
        }, 300);
        $input.focus();
      } else {
        $widget.removeClass(activeClass);
        $widget.addClass(transitionOut);
        setTimeout(function () {
          $widget.removeClass(transitionOut);
        }, 300);
      }
    },
    elementorCart: function ($scope) {
      var $target = $(".wdes-site-cart", $scope),
        $toggle = $(".wdes-site-cart-heading-link", $target),
        settings = $target.data("settings"),
        firstMouseEvent = true;

      if (settings["triggerType"] === "hover") {
        if ("ontouchend" in window || "ontouchstart" in window) {
          $target.on("touchstart", function (event) {
            scrollOffset = $(window).scrollTop();
          });

          $target.on("touchend", function (event) {
            if (scrollOffset !== $(window).scrollTop()) {
              return false;
            }

            var $this = $(this);

            if ($this.hasClass("wdes-cart-open-proccess")) {
              return;
            }

            setTimeout(function () {
              $this.toggleClass("wdes-cart-open");
            }, 10);
          });

          $(document).on("touchend", function (event) {
            if ($(event.target).closest($target).length) {
              return;
            }

            if ($target.hasClass("wdes-cart-open-proccess")) {
              return;
            }

            if (!$target.hasClass("wdes-cart-open")) {
              return;
            }

            $target.removeClass("wdes-cart-open");
          });
        } else {
          $target.on("mouseenter mouseleave", function (event) {
            if (
              !$(this).hasClass("wdes-cart-open-proccess") &&
              "mouseenter" === event.type
            ) {
              $(this).addClass("wdes-cart-open");
            }

            if (
              !$(this).hasClass("wdes-cart-open-proccess") &&
              "mouseleave" === event.type
            ) {
              $(this).removeClass("wdes-cart-open");
            }
          });
        }
      } else if (settings["triggerType"] === "click") {
        $toggle.on("click", function (event) {
          event.preventDefault();

          if (!$target.hasClass("wdes-cart-open-proccess")) {
            $target.toggleClass("wdes-cart-open");
          }
        });
      }

      $target.on("click", ".wdes-site-cart-close-button", function (event) {
        if (!$target.hasClass("wdes-cart-open-proccess")) {
          $target.toggleClass("wdes-cart-open");
        }
      });
    },

    elementorMap: function ($scope) {
      var $container = $scope.find(".wdes-map"),
        map,
        options,
        markers;
      options = $container.data("map-options");
      markers = $container.data("map-markers");
      map = new google.maps.Map($container[0], options);

      if (markers) {
        $.each(markers, function (index, marker) {
          var initmarker,
            infowindow,
            markerData = {
              position: marker.position,
              map: map,
            };

          if ("" !== marker.image) {
            if (
              undefined !== marker.image_width &&
              undefined !== marker.image_height
            ) {
              var icon = {
                url: marker.image,
                scaledSize: new google.maps.Size(
                  marker.image_width,
                  marker.image_height
                ),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(
                  marker.image_width / 2,
                  marker.image_height / 2
                ),
              };

              markerData.icon = icon;
            } else {
              markerData.icon = marker.image;
            }
          }

          initmarker = new google.maps.Marker(markerData);

          if ("" !== marker.desc) {
            infowindow = new google.maps.InfoWindow({
              content: marker.desc,
              disableAutoPan: true,
            });
          }

          initmarker.addListener("click", function () {
            infowindow.setOptions({ disableAutoPan: false });
            infowindow.open(map, initmarker);
          });

          if ("visible" === marker.state && "" !== marker.desc) {
            infowindow.open(map, initmarker);
          }
        });
      }
    },
    elementorPortfolio: function ($scope) {
      //helper functions
      var _helper = {
        removeSpaceFromString: function (string) {
          return string.toLowerCase().split(" ").join("");
        },
        visibleAnime: function (target) {
          anime({
            targets: target,
            opacity: {
              value: 1,
              duration: 400,
            },
            scale: {
              value: 1,
              duration: 500,
              easing: "easeOutExpo",
            },
            delay: 50,
            elasticity: false,
          });
          $(target).addClass("visible-status");
          $(target).removeClass("hidden-status");
        },
        hiddenAnime: function (target) {
          anime({
            targets: target,
            opacity: 0,
            scale: 0,
            delay: 500,
            elasticity: false,
          });
          $(target).removeClass("visible-status");
          $(target).addClass("hidden-status");
        },
        isRTL: function () {
          return $("body").hasClass("rtl");
        },
        getJustifyItemLayout: function (width, height) {
          var size = "justify-size-1-4",
            ratio = width / height;

          if (this.rangeCheck(ratio, 0, 1)) {
            size = "justify-size-1-4";
          }

          if (this.rangeCheck(ratio, 0, 1)) {
            size = "justify-size-2-4";
          }

          if (this.rangeCheck(ratio, 0, 1)) {
            size = "justify-size-3-4";
          }

          if (this.rangeCheck(ratio, 0, 1)) {
            size = "justify-size-4-4";
          }

          return size;
        },
        rangeCheck: function (val, min, max) {
          return val >= min && val <= max;
        },
      };

      //portfolio
      var mainEl = $(".wdes-portfolio", $scope),
        listEl = $(".wdes-portfolio-list", $scope),
        filterEl = $(".wdes-portfolio-filter", $scope),
        settingsData = $(mainEl).data("portfolio-settings"),
        imageRawData = $(listEl).data("portfolio-images"),
        categoriesRawData = $(filterEl).data("portfolio-categories"),
        sectionID = $scope.data("id"),
        classPrefix = "wdes-portfolio-",
        masonryOptions = {
          itemSelector: "." + classPrefix + "item",
          percentPosition: true,
          isOriginLeft: true === _helper.isRTL() ? false : true,
        };

      //Event
      var filterImageEvent = _.extend({}, Backbone.Events);

      //Content
      var imageModel = Backbone.Model.extend({});
      var imageCollection = Backbone.Collection.extend({
        model: imageModel,
      });

      //masonry
      var masonryInstance;

      if (settingsData.layout.type === "justify") {
        masonryOptions["columnWidth"] = ".grid-sizer";
      }

      //preset Type 1
      var imageControl = Backbone.View.extend({
        tagName: "article",
        attributes: function () {
          let attrs = {};
          attrs["id"] = this.model.get("_id");
          if (this.model.get("item_category").length > 0) {
            attrs["data-cat-slug"] = _helper.removeSpaceFromString(
              this.model.get("item_category")
            );
          }

          attrs["class"] = classPrefix + "item";

          if (settingsData.layout.type === "justify") {
            attrs["class"] +=
              " " +
              _helper.getJustifyItemLayout(
                this.model.get("item_image").width,
                this.model.get("item_image").height
              );
          }

          return attrs;
        },
        render: function () {
          var imageTemplate = _.template(
            '<div class="<%- classPrefix %>inner">' +
              '<a class="<%- classPrefix %>link" <%- lightbox %> href="<%- imgLink %>">' +
              '<div class="<%- classPrefix %>image">' +
              '<img class="<%- classPrefix %>image-instance" src="<%- imgURL %>" width="<%- imgWidth %>" height="<%- imgHeight %>" alt="<%- imgAlt %>" loading="lazy" /> ' +
              '<div class="<%- classPrefix %>image-loader"><span></span></div>' +
              "</div>" +
              "</a>" +
              "</div>"
          );

          var contentTemplate = _.template(
            '<div class="wdes-portfolio-content">' +
              '<div class="<%- classPrefix %>content-inner">' +
              '<<%- titleTag %> class="<%- classPrefix %>title"><%- title %></<%- titleTag %>>' +
              '<% if (categoryElm.length > 0) { %><h6 class="<%- classPrefix %>category"><%- categoryElm %></h6><% }  %>' +
              '<p class="<%- classPrefix %>desc"><%- desc %></p>' +
              '<% if (buttonURL.length > 0){ %> <a class="<%- classPrefix %>button" href="<%- buttonURL %>"><span class="<%- classPrefix %>button-text"><%- buttonText %></span></a><% } %></div>' +
              "</div>"
          );

          this.$el.append(
            imageTemplate({
              imgURL: this.model.get("item_image").url,
              imgLink:
                this.model.get("item_image_link") === "lightbox"
                  ? this.model.get("item_image").url
                  : this.model.get("item_button_url").url,
              imgWidth: this.model.get("item_image").width,
              imgHeight: this.model.get("item_image").height,
              imgAlt: this.model.get("item_image").alt,
              lightbox:
                this.model.get("item_image_link") === "lightbox"
                  ? "data-elementor-lightbox-slideshow=" + sectionID + "-all"
                  : "",
              classPrefix: classPrefix,
            })
          );

          this.$el.append(
            contentTemplate({
              title: this.model.get("item_title"),
              titleTag: settingsData.layout.titleHtmlTag,
              categoryElm: this.model.get("item_category"),
              desc: this.model.get("item_desc"),
              buttonURL: this.model.get("item_button_url").url,
              buttonText: this.model.get("item_button_text"),
              classPrefix: classPrefix,
            })
          );

          return this;
        },
      });

      //preset Type 2
      var imageControlTypeTwo = Backbone.View.extend({
        tagName: "article",
        attributes: function () {
          let attrs = {};
          attrs["id"] = this.model.get("_id");
          if (this.model.get("item_category").length > 0) {
            attrs["data-cat-slug"] = _helper.removeSpaceFromString(
              this.model.get("item_category")
            );
          }

          attrs["class"] = classPrefix + "item";

          if (settingsData.layout.type === "justify") {
            attrs["class"] +=
              " " +
              _helper.getJustifyItemLayout(
                this.model.get("item_image").width,
                this.model.get("item_image").height
              );
          }

          return attrs;
        },
        render: function () {
          var imageTemplate = _.template(
            '<div class="<%- classPrefix %>inner">' +
              '<a class="<%- classPrefix %>link" <%- lightbox %> href="<%- imgLink %>">' +
              '<div class="<%- classPrefix %>image">' +
              '<img class="<%- classPrefix %>image-instance" src="<%- imgURL %>" width="<%- imgWidth %>" height="<%- imgHeight %>" alt="<%- imgAlt %>" loading="lazy" /> ' +
              '<div class="<%- classPrefix %>image-loader"><span></span></div>' +
              '<% if (coverIconValue !== null && coverIconLib !== null ) { %><div class="<%- classPrefix %>cover"><i class="<%- coverIconLib %> <%- coverIconValue %>"></i></div><% }  %>' +
              "</div>" +
              "</a>" +
              "</div>"
          );

          var contentTemplate = _.template(
            '<div class="wdes-portfolio-content">' +
              '<div class="<%- classPrefix %>content-inner">' +
              '<<%- titleTag %> class="<%- classPrefix %>title"><%- title %></<%- titleTag %>>' +
              '<% if (categoryElm.length > 0) { %><h6 class="<%- classPrefix %>category"><%- categoryElm %></h6><% }  %>' +
              '<p class="<%- classPrefix %>desc"><%- desc %></p>' +
              '<% if (buttonURL.length > 0){ %> <a class="<%- classPrefix %>button" href="<%- buttonURL %>"><span class="<%- classPrefix %>button-text"><%- buttonText %></span></a><% } %></div>' +
              "</div>"
          );

          this.$el.append(
            imageTemplate({
              imgURL: this.model.get("item_image").url,
              imgLink:
                this.model.get("item_image_link") === "lightbox"
                  ? this.model.get("item_image").url
                  : this.model.get("item_button_url").url,
              imgWidth: this.model.get("item_image").width,
              imgHeight: this.model.get("item_image").height,
              imgAlt: this.model.get("item_image").alt,
              lightbox:
                this.model.get("item_image_link") === "lightbox"
                  ? "data-elementor-lightbox-slideshow=" + sectionID + "-all"
                  : "",
              coverIconValue: settingsData.layout.coverIcon.value,
              coverIconLib: settingsData.layout.coverIcon.library,
              classPrefix: classPrefix,
            })
          );

          this.$el.append(
            contentTemplate({
              title: this.model.get("item_title"),
              titleTag: settingsData.layout.titleHtmlTag,
              categoryElm: this.model.get("item_category"),
              desc: this.model.get("item_desc"),
              buttonURL: this.model.get("item_button_url").url,
              buttonText: this.model.get("item_button_text"),
              classPrefix: classPrefix,
            })
          );

          return this;
        },
      });

      //preset Type 3
      var imageControlTypeThere = Backbone.View.extend({
        tagName: "article",
        attributes: function () {
          let attrs = {};
          attrs["id"] = this.model.get("_id");
          if (this.model.get("item_category").length > 0) {
            attrs["data-cat-slug"] = _helper.removeSpaceFromString(
              this.model.get("item_category")
            );
          }

          attrs["class"] = classPrefix + "item";

          if (settingsData.layout.type === "justify") {
            attrs["class"] +=
              " " +
              _helper.getJustifyItemLayout(
                this.model.get("item_image").width,
                this.model.get("item_image").height
              );
          }

          return attrs;
        },
        render: function () {
          var imageTemplate = _.template(
            '<div class="<%- classPrefix %>inner">' +
              '<a class="<%- classPrefix %>link" <%- lightbox %> href="<%- imgLink %>">' +
              '<div class="<%- classPrefix %>image">' +
              '<img class="<%- classPrefix %>image-instance" src="<%- imgURL %>" width="<%- imgWidth %>" height="<%- imgHeight %>" alt="<%- imgAlt %>" loading="lazy" /> ' +
              '<div class="<%- classPrefix %>image-loader"><span></span></div>' +
              '<% if (coverIconValue !== null && coverIconLib !== null ) { %><div class="<%- classPrefix %>cover"><i class="<%- coverIconLib %> <%- coverIconValue %>"></i></div><% }  %>' +
              "</div>" +
              "</a>" +
              "</div>"
          );

          this.$el.append(
            imageTemplate({
              imgURL: this.model.get("item_image").url,
              imgLink:
                this.model.get("item_image_link") === "lightbox"
                  ? this.model.get("item_image").url
                  : this.model.get("item_button_url").url,
              imgWidth: this.model.get("item_image").width,
              imgHeight: this.model.get("item_image").height,
              imgAlt: this.model.get("item_image").alt,
              lightbox:
                this.model.get("item_image_link") === "lightbox"
                  ? "data-elementor-lightbox-slideshow=" + sectionID + "-all"
                  : "",
              coverIconValue: settingsData.layout.coverIcon.value,
              coverIconLib: settingsData.layout.coverIcon.library,
              classPrefix: classPrefix,
            })
          );

          return this;
        },
      });

      //preset Type 4
      var imageControlTypeFour = Backbone.View.extend({
        tagName: "article",
        attributes: function () {
          let attrs = {};
          attrs["id"] = this.model.get("_id");
          if (this.model.get("item_category").length > 0) {
            attrs["data-cat-slug"] = _helper.removeSpaceFromString(
              this.model.get("item_category")
            );
          }

          attrs["class"] = classPrefix + "item";

          if (settingsData.layout.type === "justify") {
            attrs["class"] +=
              " " +
              _helper.getJustifyItemLayout(
                this.model.get("item_image").width,
                this.model.get("item_image").height
              );
          }

          return attrs;
        },
        render: function () {
          var imageTemplate = _.template(
            '<div class="<%- classPrefix %>inner">' +
              '<a class="<%- classPrefix %>link" <%- lightbox %> href="<%- imgLink %>">' +
              '<div class="<%- classPrefix %>image">' +
              '<img class="<%- classPrefix %>image-instance" src="<%- imgURL %>" width="<%- imgWidth %>" height="<%- imgHeight %>" alt="<%- imgAlt %>" loading="lazy" /> ' +
              '<div class="<%- classPrefix %>image-loader"><span></span></div>' +
              "</div>" +
              "</a>" +
              "</div>"
          );

          var contentTemplate = _.template(
            '<div class="wdes-portfolio-content">' +
              '<div class="<%- classPrefix %>content-inner">' +
              '<<%- titleTag %> class="<%- classPrefix %>title"><%- title %></<%- titleTag %>>' +
              '<% if (categoryElm.length > 0) { %><h6 class="<%- classPrefix %>category"><%- categoryElm %></h6><% }  %>' +
              '<p class="<%- classPrefix %>desc"><%- desc %></p>' +
              '<% if (buttonURL.length > 0){ %> <a class="<%- classPrefix %>button" href="<%- buttonURL %>"><span class="<%- classPrefix %>button-text"><%- buttonText %></span></a><% } %></div>' +
              "</div>"
          );

          this.$el.append(
            imageTemplate({
              imgURL: this.model.get("item_image").url,
              imgLink:
                this.model.get("item_image_link") === "lightbox"
                  ? this.model.get("item_image").url
                  : this.model.get("item_button_url").url,
              imgWidth: this.model.get("item_image").width,
              imgHeight: this.model.get("item_image").height,
              imgAlt: this.model.get("item_image").alt,
              lightbox:
                this.model.get("item_image_link") === "lightbox"
                  ? "data-elementor-lightbox-slideshow=" + sectionID + "-all"
                  : "",
              classPrefix: classPrefix,
            })
          );

          this.$el.append(
            contentTemplate({
              title: this.model.get("item_title"),
              titleTag: settingsData.layout.titleHtmlTag,
              categoryElm: this.model.get("item_category"),
              desc: this.model.get("item_desc"),
              buttonURL: this.model.get("item_button_url").url,
              buttonText: this.model.get("item_button_text"),
              classPrefix: classPrefix,
            })
          );

          return this;
        },
      });

      var portfolioControl = Backbone.View.extend({
        tagName: "div",
        className: classPrefix + "list",
        initialize: function (options) {
          this.filterImageEvent = options.filterImageEvent;
          this.filterImageEvent.on(
            "categorySelected",
            this.onCategorySelected,
            this
          );
        },
        catSelected: "",
        onCategorySelected: function (model) {
          this.catSelected = model.get("idItem");
          this.renderAfterFilter();
        },
        renderAfterFilter() {
          var _self = this;
          this.model.each(function (item) {
            var item_category = _helper.removeSpaceFromString(
              item.get("item_category")
            );
            var selector = _self.$el.find("#" + item.get("_id"))[0];

            if (
              item_category === _self.catSelected ||
              _self.catSelected === "all"
            ) {
              _helper.visibleAnime(selector);
              $("a", selector).attr(
                "data-elementor-lightbox-slideshow",
                sectionID + "-" + _self.catSelected
              );
            } else {
              _helper.hiddenAnime(selector);
            }
          });
        },
        render: function () {
          var _self = this;
          if (settingsData.layout.type === "justify") {
            this.$el.append('<div class="grid-sizer"></div>');
          }
          this.model.each(function (item) {
            var imageView;

            if (settingsData.layout.preset === "type-1") {
              imageView = new imageControl({ model: item });
            }

            if (settingsData.layout.preset === "type-2") {
              imageView = new imageControlTypeTwo({ model: item });
            }

            if (settingsData.layout.preset === "type-3") {
              imageView = new imageControlTypeThere({ model: item });
            }

            if (settingsData.layout.preset === "type-4") {
              imageView = new imageControlTypeFour({ model: item });
            }

            _self.$el.append(imageView.render().$el);
            _helper.visibleAnime(imageView.$el[0]);
          });

          if (
            settingsData.layout.type === "masonry" ||
            settingsData.layout.type === "justify"
          ) {
            masonryInstance = listEl.masonry(masonryOptions);
          }

          if (masonryInstance) {
            masonryInstance.masonry("layout");
          }
        },
      });

      var image = new imageCollection();

      _.each(imageRawData, function (item) {
        image.add(item);
      });

      var portfolioView = new portfolioControl({
        el: listEl,
        model: image,
        filterImageEvent: filterImageEvent,
      });

      portfolioView.render();
      $(mainEl).removeAttr("data-portfolio-images");

      // filter
      var filterModel = Backbone.Model.extend({
        defaults: {
          classItem: "",
        },
      });
      var filterCollection = Backbone.Collection.extend({
        model: filterModel,
      });

      var filterItemControl = Backbone.View.extend({
        tagName: "div",
        initialize: function (options) {
          this.filterImageEvent = options.filterImageEvent;
        },
        attributes: function () {
          // Return model data
          return {
            id: this.model.get("idItem"),
            class:
              classPrefix + "filter-item" + " " + this.model.get("classItem"),
          };
        },
        events: {
          click: "addClassActive",
        },
        addClassActive: function (el) {
          this.filterImageEvent.trigger("categorySelected", this.model);
          this.model.set("classItem", "active");
        },
        render: function () {
          var contentTemplate = _.template("<span> <%- catName %> </span>");

          this.$el.html(
            contentTemplate({ catName: this.model.get("catName") })
          );

          return this;
        },
      });

      var filterItemSeparator = Backbone.View.extend({
        render: function () {
          var separatorTemplate = _.template(
            '<span class="<%- classPrefix %>filter-item-separator"> <i aria-hidden="true" class="<%- iconLib %> <%- iconValue %>"></i> </span>'
          );

          this.$el.html(
            separatorTemplate({
              iconValue: settingsData.filter.separatorIcon.value,
              iconLib: settingsData.filter.separatorIcon.library,
              classPrefix: classPrefix,
            })
          );

          return this;
        },
      });

      var filterControl = Backbone.View.extend({
        tagName: "div",
        className: classPrefix + "filter-list",
        initialize: function (options) {
          this.filterImageEvent = options.filterImageEvent;
          this.model.on("change", this.renderClassActive, this);
        },
        lastChangedModelID: "",
        renderClassActive: function (model) {
          var lastActiveItem = filter.get(this.lastChangedModelID);

          if (lastActiveItem != undefined) {
            lastActiveItem.set({ classItem: "" }, { silent: true });
          }
          this.lastChangedModelID = model.cid;

          this.render();
        },
        render: function () {
          var _self = this;

          _self.$el.html("");

          this.model.each(function (item) {
            var filterItemView = new filterItemControl({
              model: item,
              filterImageEvent: filterImageEvent,
            });
            var filterItemSeparatorView = new filterItemSeparator();

            if (item.get("idItem") != "all") {
              if (settingsData.filter.separatorIcon.value != null) {
                _self.$el.append(filterItemSeparatorView.render().$el);
              }
            }
            _self.$el.append(filterItemView.render().$el);
          });

          return this;
        },
      });

      var filter = new filterCollection(),
        allModel = new filterModel(),
        allLabel =
          settingsData.filter.label != null &&
          settingsData.filter.label.length > 0
            ? _.escape(settingsData.filter.label)
            : "All";
      allModel.set("catName", allLabel);
      allModel.set("idItem", "all");
      filter.add(allModel);

      _.each(categoriesRawData, function (item) {
        let filterItem = {};
        filterItem.idItem = _helper.removeSpaceFromString(item);
        filterItem.catName = item;
        filter.add(filterItem);
      });

      if (settingsData.filter.enable) {
        var filterView = new filterControl({
          model: filter,
          filterImageEvent: filterImageEvent,
        });
        $(filterEl).html(filterView.render().$el);
      }

      //imageloader

      if (typeof $.fn.imagesLoaded === "function") {
        $("." + classPrefix + "image", listEl)
          .imagesLoaded()
          .progress(function (instance, imageEl) {
            var image = $(imageEl.img),
              parentItem = image.closest("." + classPrefix + "item"),
              loader = $("." + classPrefix + "image-loader", parentItem);

            loader.remove();

            parentItem.addClass("item-loaded");

            if (masonryInstance) {
              masonryInstance.masonry("layout");
            }
          });
      } else {
        var loader = $("." + classPrefix + "image-loader", listEl);

        $(listEl).addClass("item-loaded");

        loader.remove();
      }

      //remove all settings and data
      $(listEl).removeAttr("data-portfolio-images");
      $(mainEl).removeAttr("data-portfolio-settings");
      $(filterEl).removeAttr("data-portfolio-categories");
    },
    elementorProgress: function ($scope) {
      // // import from portfolio file
      //General vars
      var mainEl = $(".wdes-progress", $scope),
        settings = mainEl.data("progress-settings"),
        icon = $(".wdes-icon-data-move", $scope).find("i"),
        classPrefixBar = "wdes-progress-bar",
        classPrefixCircle = "wdes-circle-progress";

      //Model & View
      var progressModel = Backbone.Model.extend({
        defaults: _.chain(settings).reverse().value(),
      });

      //title section
      var progressBarTitleSectionController = Backbone.View.extend({
        className: classPrefixBar + "-title",
        render: function () {
          let titleTemplate = _.template(
            '<span class="<%= classPrefixBar %>-title-text"><%= title %></span>'
          );
          let iconTemplate = _.template(
            '<% if(!_.isNull(icon)){ %><span class="<%= classPrefixBar %>-title-icon wdes-elements-icon"><%}%>'
          );
          this.$el.append(
            iconTemplate({ icon: this.model.get("icon"), classPrefixBar })
          );
          this.$el.find(".wdes-progress-bar-title-icon").append(icon);
          this.$el.append(
            titleTemplate({ title: this.model.get("title"), classPrefixBar })
          );
          return this;
        },
      });

      //percentage counter
      var percentCounter = Backbone.View.extend({
        className: "wdes-progress-bar-percent",
        template: _.template(
          '<span class="wdes-progress-bar-percent-value">0</span><span class="wdes-progress-bar-percent-suffix">&#37;</span>'
        ),
        render: function () {
          this.$el.append(this.template());
          return this;
        },
      });

      //Content Wrapper
      var progressBarContentWrapper = Backbone.View.extend({
        className: "wdes-progress-bar-wrapper",
        render: function (includeC4IntoStatusBar, includeC4) {
          let statuesBarTemplate = _.template(
            '<div class="wdes-progress-bar-status-bar"></div>'
          );
          let percentTemp = new percentCounter();

          this.$el.append(statuesBarTemplate());

          if (includeC4IntoStatusBar) {
            this.$el
              .find(".wdes-progress-bar-status-bar")
              .append(percentTemp.render().$el);
          }

          if (includeC4) {
            this.$el.append(percentTemp.render().$el);
          }

          return this;
        },
      });

      var progressBarControl = Backbone.View.extend({
        className: classPrefixBar + "-inner",
        render: function () {
          let preset = this.model.get("preset");
          let titleSectionView = new progressBarTitleSectionController({
            model: this.model,
          });
          let contentWrapperSectionView = new progressBarContentWrapper({
            model: this.model,
          });
          let percentTemp = new percentCounter();

          switch (preset) {
            case "type-1":
              this.$el.append(titleSectionView.render().$el);
              this.$el.append(
                contentWrapperSectionView.render(true, false).$el
              );
              break;
            case "type-2":
              this.$el.append(percentTemp.render().$el);
              this.$el.append(
                contentWrapperSectionView.render(false, false).$el
              );
              this.$el.append(titleSectionView.render().$el);
              break;
            case "type-3":
              this.$el.append(
                contentWrapperSectionView.render(true, false).$el
              );
              this.$el.append(titleSectionView.render().$el);
              break;
            case "type-4":
              this.$el.append(titleSectionView.render().$el);
              this.$el.append(
                contentWrapperSectionView.render(false, false).$el
              );
              this.$el.append(percentTemp.render().$el);
              break;
            case "type-5":
              this.$el.append(titleSectionView.render().$el);
              this.$el.append(
                contentWrapperSectionView.render(false, true).$el
              );
              break;
            case "type-6":
              this.$el.append(
                contentWrapperSectionView.render(false, false).$el
              );
              this.$el
                .find(".wdes-progress-bar-wrapper")
                .append('<div class="wdes-progress-bar-status"></div>');
              this.$el
                .find(".wdes-progress-bar-status")
                .append(percentTemp.render().$el);
              this.$el
                .find(".wdes-progress-bar-status")
                .append(titleSectionView.render().$el);
              break;
          }

          return this;
        },
      });

      //Progress Circle Bar Content
      var progressCircleCounterControl = Backbone.View.extend({
        className: "circle-counter",
        render: function () {
          let circleValue = _.template(
            '<% if( percPosition === processedItem ){ %><div class="circle-val">' +
              '<% if( prefix.length > 0 ){ %><span class="circle-counter-prefix"><%= prefix %></span><% } %>' +
              '<span class="circle-counter-number"></span>' +
              '<% if( suffix.length > 0 ){ %><span class="circle-counter-suffix"><%= suffix %></span><% } %>' +
              "</div>" +
              "<% } %>"
          );

          let circleCounter = _.template(
            '<% if( labelsPosition === processedItem ){ %><div class="circle-counter-content">' +
              '<% if( title.length > 0 ){ %><div class="circle-counter-title"><%= title %></div><% } %>' +
              '<% if( subtitle.length > 0 ){ %><div class="circle-counter-subtitle"><%= subtitle %></div><% } %>' +
              "</div>" +
              "<% } %>"
          );

          this.$el.append(
            circleValue({
              percPosition: this.model.get("percentPosition"),
              processedItem: this.model.get("processedItem"),
              prefix: this.model.get("prefix"),
              suffix: this.model.get("suffix"),
            })
          );

          this.$el.append(
            circleCounter({
              labelsPosition: this.model.get("labelsPosition"),
              processedItem: this.model.get("processedItem"),
              title: this.model.get("title"),
              subtitle: this.model.get("subtitle"),
            })
          );

          return this;
        },
      });

      var progressCircleInsideBarControl = Backbone.View.extend({
        className: "position-in-circle",
        render: function () {
          this.model.set("processedItem", "in-circle");
          let progressCircleCounterView = new progressCircleCounterControl({
            model: this.model,
          });
          this.$el.append(progressCircleCounterView.render().$el);
          return this;
        },
      });

      var progressCircleOutsideBarControl = Backbone.View.extend({
        className: "position-below-circle",
        processedItem: "out-circle",
        render: function () {
          this.model.set("processedItem", "out-circle");
          let progressCircleCounterView = new progressCircleCounterControl({
            model: this.model,
          });
          this.$el.append(progressCircleCounterView.render().$el);
          return this;
        },
      });

      var progressCircleBarControl = Backbone.View.extend({
        className: classPrefixCircle + "-bar",
        render: function () {
          let circleLibTemplate = _.template(
            '<div class="<%= classPrefixCircle %>-init-circle"></div>'
          );
          this.$el.append(circleLibTemplate({ classPrefixCircle }));
          if (
            this.model.get("percentPosition") === "in-circle" ||
            this.model.get("labelsPosition") === "in-circle"
          ) {
            let progressCircleInsideBarView =
              new progressCircleInsideBarControl({ model: this.model });
            this.$el
              .find("." + classPrefixCircle + "-init-circle")
              .append(progressCircleInsideBarView.render().$el);
          }
          return this;
        },
      });

      var progressCircleControl = Backbone.View.extend({
        className: classPrefixCircle + "-wrap",
        render: function () {
          let progressCircleBarControlView = new progressCircleBarControl({
            model: this.model,
          });
          this.$el.append(progressCircleBarControlView.render().$el);

          if (
            this.model.get("percentPosition") === "out-circle" ||
            this.model.get("labelsPosition") === "out-circle"
          ) {
            let progressCircleOutsideBarView =
              new progressCircleOutsideBarControl({ model: this.model });
            this.$el.append(progressCircleOutsideBarView.render().$el);
          }

          //circle progress lib init
          let config = this.model.get("config"),
            fill = "";

          if (config.strokeType === "color") {
            fill = config.strokeColor;
          }
          console.log(config.strokeType);
          if (config.strokeType === "gradient") {
            fill = {
              gradient: [config.strokeGradientA, config.strokeGradientB],
              gradientAngle: config.strokeGradientAngle,
            };
          }

          let $this = this;
          this.$el
            .find("." + classPrefixCircle + "-init-circle")
            .circleProgress({
              value: this.model.get("percentValue").size / 100,
              size: config.size,
              thickness: config.stroke,
              fill: fill,
              startAngle: config.angle,
              emptyFill: config.strokeGB,
              lineCap: config.linecap,
              animation: {
                duration: config.duration,
                easing: "circleProgressEasing",
              },
            })
            .on(
              "circle-animation-progress",
              function (event, progress, stepValue) {
                $this.$el
                  .find(".circle-counter-number")
                  .text(stepValue.toFixed(2).substr(2));
              }
            );
          return this;
        },
      });

      var progressController = Backbone.View.extend({
        render: function (model) {
          let type = this.model.get("type");

          if (type === "bar") {
            let progressBarView = new progressBarControl({ model: this.model });
            this.$el.html(progressBarView.render().$el);
          }

          if (type === "circle") {
            let progressCircleView = new progressCircleControl({
              model: this.model,
            });
            this.$el.html(progressCircleView.render().$el);
          }

          return this;
        },
      });

      var progressData = new progressModel(),
        progressView = new progressController({
          el: mainEl,
          model: progressData,
        });

      progressView.render();

      //anime
      if (settings.type === "bar") {
        var percent = settings.percent,
          statusBarBlock = $(".wdes-progress-bar-status-bar", $scope),
          percentBlock = $(".wdes-progress-bar-percent-value", $scope),
          animeObject = { charged: 0 };

        statusBarBlock.css({
          width: percent + "%",
        });
        anime({
          targets: animeObject,
          charged: percent,
          round: 1,
          duration: 1000,
          easing: "easeInOutQuad",
          update: function () {
            percentBlock.html(animeObject.charged);
          },
        });
      }
    },
    elementorRangeSlider: function ($scope) {
      var tiers_data = $(".wdes-range-slider", $scope).data("range-tiers"),
        tiers = [];

      _.each(tiers_data, function (item) {
        var rangeTemplate = _.template(
          '<% if(textDecoration === "icon" && iconVal.length > 0 ) { %><i class="<%- classPrefix %>-icon <%- iconLib %> <%- iconVal %>"></i><% } %>' +
            '<% if(textDecoration === "image" && imageURL.length > 0) { %><img class="<%- classPrefix %>-image" src="<%- imageURL %>"><% } %>' +
            '<% if(label.length > 0) { %><h4 class="<%- classPrefix %>-label"><%- label %></h4><% } %>' +
            '<% if(description.length > 0) { %><p class="<%- classPrefix %>-description"><%- description %></p><% } %>'
        );

        tiers.push(
          rangeTemplate({
            label: item.label,
            description: item.desc,
            textDecoration: item.textDecoration,
            iconVal: item.icon.value !== undefined ? item.icon.value : "",
            iconLib: item.icon.library !== undefined ? item.icon.library : "",
            imageURL: item.image.url !== undefined ? item.image.url : "",
            classPrefix: "wdes-range-slider",
          })
        );
      });

      $(".slider-tiers", $scope)
        .slider({
          min: 0,
          max: tiers.length - 1,
          range: "min",
          value: 0,
        })
        .slider("pips", {
          rest: "label",
          labels: tiers,
        })
        .on("slidechange slide", function (e, ui) {
          $(".slider-content .slider-content-item", $scope).each(function (
            i,
            obj
          ) {
            if (ui.value === i) {
              $(obj).addClass("d-block");
            } else {
              if ($(obj).hasClass("d-block")) {
                $(obj).removeClass("d-block");
                $(obj).addClass("d-none");
              }
            }
          });
        });
    },
    mobileAndTabletCheck: function () {
      var check = false;

      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);

      return check;
    },

    isEditMode: function () {
      return Boolean(elementorFrontend.isEditMode());
    },
  };

  $(window).on("elementor/frontend/init", WdesWidgets.init);
})(jQuery, window.elementorFrontend);
